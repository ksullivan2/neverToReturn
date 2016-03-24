//SETUP SERVER------------------------------------------------------------------------------------------------------------------
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require("express-session")({
  secret: "hope and joy",
  resave: true,
  saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

// attach session
app.use(session); 

//share session with io sockets
io.use(sharedsession(session, {
    autoSave:true
})); 

app.use(express.static("build"));

app.get('/', function(req,res) {
	if(process.env.NODE_ENV!="DEVELOPMENT"){
		res.sendFile(__dirname + '/index.html');
		
	} else{
		res.sendFile(__dirname + '/index-dev.html');
	}
});

server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

//game-specific libraries------------------------------------------------------------------------------------------------------------------
var Game = require("./game_modules/gameLogic.js");
var gameStates = require("./game_modules/gameStates.js");

var gameLogic = new Game();

//SOCKET EVENTS------------------------------------------------------------------------------------------------------------------

io.on('connection', function (socket) {
  //if we don't have previous cookie data...
  if (!socket.handshake.session.userdata && gameLogic.gameState === gameStates.gatherPlayers){
    //tell the game we have a new player and if Player 1,2, etc.
    socket.emit("new player", {playerIndex: Object.keys(gameLogic.players).length+1});
  }else if (socket.handshake.session.userdata){
    console.log("SESSION RESTORED ", socket.handshake.session.userdata.name)
    //overwrite the socket data for that player, using cookie data
    var name = socket.handshake.session.userdata.name;
    gameLogic.resetSocket(name,socket.id);
    //send the user their previous name
    socket.emit("update userName", {userName: name})
  }else{
    console.log("NEW PLAYER OUTSIDE OF APPROPRIATE WINDOW", socket.handshake.session.userdata)
  }

  //socket will ALWAYS emit updated logic upon connection
  socket.emit("update gameLogic in view", {gameLogic: gameLogic})

  //DEBUG FUNCTIONS
  socket.on('restart game', function(){
    gameLogic = new Game()
    io.sockets.emit("new player", {playerIndex: Object.keys(gameLogic.players).length+1})
  });

  socket.on("reconnect player", function(data){
    if (gameLogic.players.hasOwnProperty(data.name)){
      gameLogic.resetSocket(data.name,socket.id);
      socket.emit("update userName", {userName: data.name})
      socket.emit("update gameLogic in view", {gameLogic: gameLogic})
    } else {
      socket.emit('reconnect failed')
    }
  });

  socket.on('create player', function(data){   
  	var validName = gameLogic.addPlayer(data.name, data.socketID);
    if (!validName){
      socket.emit("name taken", {playerIndex: Object.keys(gameLogic.players).length+1});
    } else{

      socket.handshake.session.userdata = data;
      socket.emit("update userName", {userName: data.name})
      io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic})
    }
  });

//buttons in action area----------------------------------------------------------------------
  socket.on('Start Game', function(){
    startGame();
  });


	socket.on("Move Forward", function(data){
    //check for gameState so that we can't get a double-press
    if (gameLogic.gameState === gameStates.waitingForPlayerInput && data.userName === gameLogic.activePlayer.name){
      gameLogic.gameState = gameStates.animationsPlayingOut;
      gameLogic.addActionToPlayerActionsQueue(data.userName, {type:"move", value: 1})
      processQueue()
    }
 
  });

  socket.on("Move Backward", function(data){
    //check for gameState so that we can't get a double-press
    if (gameLogic.gameState === gameStates.waitingForPlayerInput && data.userName === gameLogic.activePlayer.name){
      gameLogic.addActionToPlayerActionsQueue(data.userName, {type:"move", value: -1})
      gameLogic.gameState = gameStates.animationsPlayingOut;
      processQueue()
    }
    
  });

  socket.on("Roll Check", function(data){
    //check for gameState so that we can't get a double-press
    if (gameLogic.gameState === gameStates.waitingForPlayerInput && data.userName === gameLogic.activePlayer.name){
      gameLogic.gameState = gameStates.animationsPlayingOut;
      processCheck();
    }
    
  });


});

//CONTROLLING TURNS----------------------------------------------------------------------


var startGame = function(){
  console.log("startGame")
  gameLogic.initializeGame();
  gameLogic.initializeTurn();
  processQueue();
}

var startNewTurn = function(){
  console.log("startNewTurn")
  gameLogic.changeActivePlayer();
  gameLogic.initializeTurn();
  processQueue();
}

var printQueue = function(){
  var queue = gameLogic.turn.terrainEffectsQueue.concat(gameLogic.turn.playerActionsQueue.concat(gameLogic.turn.endTurnQueue));
  console.log("queue currently is:")
  for (var i = 0; i < queue.length; i++) {
    console.log(i, queue[i].type)
  }
}

var processQueue = function(){
  printQueue()
 //if there are any events in the terrainEffectsQueue, give those priority
 //else do the next player action
 //finally do endTurnQueue
 //if nothing in queues, it's the end of the turn

 if (gameLogic.turn.terrainEffectsQueue.length > 0){
  gameLogic.turn.currentEvent = gameLogic.turn.terrainEffectsQueue.shift()
 } else if (gameLogic.turn.playerActionsQueue.length > 0){
    gameLogic.turn.currentEvent = gameLogic.turn.playerActionsQueue.shift()
 } else if (gameLogic.turn.endTurnQueue.length > 0){
      gameLogic.turn.currentEvent = gameLogic.turn.endTurnQueue.shift()
 } else {
      startNewTurn();
      return
 }

 processEvent(gameLogic.turn.currentEvent);

}

var processCheck = function(){
  var event = gameLogic.turn.currentEvent
  //roll a D10
  var dice = Math.floor(Math.random() * 10 + 1);


  //all bonuses will be stored in the "turn" object, don't worry about on server
  if (gameLogic.isCheckPassed(event.target, event.checkStat, dice)){
    //add the check's consequences to the queue to be processed next
    gameLogic.turn.terrainEffectsQueue = event.ifPass.concat(gameLogic.turn.terrainEffectsQueue)
  } else {
    gameLogic.turn.terrainEffectsQueue = event.ifFail.concat(gameLogic.turn.terrainEffectsQueue) 
  }

  //add an event to the front of the queue to view the result of the roll
  gameLogic.turn.terrainEffectsQueue.unshift({type: "display", value: dice})
  processQueue();
}

var processEvent = function(event){
  io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic});

  var target = gameLogic.activePlayer.name;
  if (!event.target){
    event.target = target;
  }
  //EVENTUALLY ALLOW EVENTS TO TARGET OTHER PLAYERS/MONSTERS ETC


  if (event.type == "check"){
    gameLogic.gameState = gameStates.waitingForPlayerInput;
    io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic})
    return
  }

  else if (event.type == "display"){
    gameLogic.gameState = gameStates.animationsPlayingOut;
  }
  

  else if (event.type === "pain" || event.type === "madness"){
    gameLogic.affectMenace(target, event.type, event.value)
  }

  else if (event.type === "move"){
    gameLogic.gameState = gameStates.animationsPlayingOut;
    move(gameLogic.activePlayer.name, event.value)
  }




  //OLD EVENTS HERE
  //add a check for if it requires user interaction
  if (event.type === "choosePlayerAction"){
    gameLogic.gameState = gameStates.waitingForPlayerInput;
    io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic})
    return
  }
 

 
  else{
    gameLogic.gameState = gameStates.animationsPlayingOut; 
  }

  io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic})
  setTimeout(processQueue, 1000);
}

//EVENT TYPES----------------------------------------------------------------------
var move = function(userName, direction){
  gameLogic.movePlayer(userName, direction);
}
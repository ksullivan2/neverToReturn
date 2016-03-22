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
    gameLogic.startGame()
    gameLogic.turn = new Turn()
    playOutTurn();
  });

  socket.on('End Turn', function(){
    gameLogic.changeActivePlayer()
    gameLogic.turn = new Turn()
    playOutTurn()
  });

	socket.on("Move Forward", function(data){
    move(data.userName, 1)
  });

  socket.on("Move Backward", function(data){
    move(data.userName, -1)
  });


});

//CONTROLLING TURNS----------------------------------------------------------------------
function Turn(){
  //these arrays will be filled with objects/events to fire and will always be resolved in order
  this.terrainEffects = [];
  this.playerActions = [];
}

var playOutTurn = function(){
  //set new game state
  gameLogic.gameState = gameStates.turnStart;
  io.sockets.emit('update gameLogic in view', {gameLogic: gameLogic})

   //TODO: desperation check
  gameLogic.turn.terrainEffects = gameLogic.collectTurnStartEffects();

  while (gameLogic.turn.terrainEffects.length > 0){
    processEvent(gameLogic.turn.terrainEffects.shift());
  }
}

var processEvent = function(event){
  if (event === "Move Forward"){
    move(gameLogic.activePlayer.name, 1)
  }
  if (event === "Move Backward"){
    move(gameLogic.activePlayer.name, -1)
  }
}

//EVENT TYPES----------------------------------------------------------------------
var move = function(userName, direction){
  gameLogic.movePlayer(userName, direction);
  io.sockets.emit('update gameLogic in view', {gameLogic: gameLogic})
}
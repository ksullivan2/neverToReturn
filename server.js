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
const STANDARD_PLAYER_ACTIONS = require("./CONFIG FILES/gamePlayConfig.js").standardPlayerActions;



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
  socket.on("action button pressed", function(data){
    if (data.buttonText === "Start Game"){
      startGame();
    }

    //WAITING FOR PLAYER INPUT (STANDARD ACTIONS)
    if (gameLogic.gameState === gameStates.waitingForPlayerInput && data.userName === gameLogic.activePlayer.name){
      switch (data.buttonText){

        case STANDARD_PLAYER_ACTIONS.MOVE_FORWARD.buttonText:
          processStandardAction(data, "MOVE_FORWARD")
          break;

        case STANDARD_PLAYER_ACTIONS.MOVE_BACKWARD.buttonText:
          processStandardAction(data, "MOVE_BACKWARD")
          break;

        case STANDARD_PLAYER_ACTIONS.TRADE_MENACE_FOR_MONSTER.buttonText:
          processStandardAction(data, "TRADE_MENACE_FOR_MONSTER")
          break;

        case STANDARD_PLAYER_ACTIONS.REFILL_HAND.buttonText:
          processStandardAction(data, "REFILL_HAND")
          break;  

        case STANDARD_PLAYER_ACTIONS.ACTION_CARD.buttonText:
          processStandardAction(data, "ACTION_CARD")
          break;

        case STANDARD_PLAYER_ACTIONS.DISCARD_AND_DRAW.buttonText:
          processStandardAction(data, "DISCARD_AND_DRAW")
          // gameLogic.gameState = gameStates.chooseCardToDiscard;
          // io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic}); 
          break;  


        //CHECKS
        case "Roll Check":
          processCheck();
          break;

        case "Discard For Bonus":
          gameLogic.gameState = gameStates.chooseActionCard
          ;
          io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic});
          break;


        //menace buttons
        case "Pain":
          addMenaceToCurrentEvent("pain")
          break;

        case "Madness":
          addMenaceToCurrentEvent("madness")
          break;
      }
    }
 
  });


  socket.on("Action Card Pressed", function(data){
    if (gameLogic.gameState === gameStates.chooseActionCard && data.userName === gameLogic.activePlayer.name){
      
      //since this optional action happens in the middle of processing another
      //it can't be in the normal flow, and needs a custom function
      if (gameLogic.turn.currentEvent.type === "check"){
        processDiscardForBonus(data)
      }

      
      switch (gameLogic.turn.currentEvent.cardFate){
        case "discard":
          gameLogic.addActionToImmediateQueue(data.userName, {type: "discard", cardName: data.card.name, value: 1})
          break;

        case "play":
          playActionCard(data)
          break;
      }

      processQueue()

    }

  })


});


//SOCKET ACTION PROCESSERS----------------------------------------------------------------------------------
var processStandardAction = function(data, nameOfAction){
  gameLogic.gameState = gameStates.animationsPlayingOut;
  gameLogic.decrementTurnActions();
  STANDARD_PLAYER_ACTIONS[nameOfAction].actions.forEach(function(event){
    gameLogic.addActionToPlayerActionsQueue(data.userName, event)
  })

  processQueue()
}

var playActionCard = function(data){
  //data is username and card
  for (var i = 0; i < data.card.actions.length; i++) {
    gameLogic.addActionToPlayerActionsQueue(data.userName, data.card.actions[i])
  }
  gameLogic.discardCard(data.userName, data.card.name)
  gameLogic.incrementCardsToDraw(1);
  
}

var addMenaceToCurrentEvent = function(menace){
  gameLogic.turn.currentEvent.menace = menace
  processEvent(gameLogic.turn.currentEvent)
}


var processCheck = function(){
  gameLogic.gameState = gameStates.animationsPlayingOut;

  var event = gameLogic.turn.currentEvent
  //roll a D10
  var dice = Math.floor(Math.random() * 10 + 1);

  //add an event to the front of the queue to view the result of the roll
  gameLogic.addActionToImmediateQueue(null,{type: "display", value: dice})

  //all handicaps will be stored in the "turn" object, don't worry about on server
  if (gameLogic.isCheckPassed(event.target, event.menace, dice)){
    //add the check's consequences to the queue to be processed next
    for (var i = 0; i < event.ifPass.length; i++) {
      gameLogic.addActionToImmediateQueue(event.source, event.ifPass[i])
    }
    
  } else {
    for (var i = 0; i < event.ifFail.length; i++) {
      gameLogic.addActionToImmediateQueue(event.source, event.ifFail[i])
    } 
  }

  
  processQueue();
}

processDiscardForBonus = function(data){
  gameLogic.gameState = gameStates.waitingForPlayerInput;
  gameLogic.updateHandicap(gameLogic.turn.currentEvent.menace, 2)

  //directly update the handicap, then immediately undo that before anything else is processed
  gameLogic.addActionToImmediateQueue(data.userName, {type: "handicap", menace: gameLogic.turn.currentEvent.menace, value: -2})

  gameLogic.discardCard(data.userName, data.card.name)

  //make sure the button doesn't show up if there are no cards left
  gameLogic.pruneActionsList()

  io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic});
}


//CONTROLLING TURNS----------------------------------------------------------------------


var startGame = function(){
  gameLogic.initializeGame();
  gameLogic.initializeTurn();
  processQueue();
}

var startNewTurn = function(){
  gameLogic.changeActivePlayer();
  gameLogic.initializeTurn();
  processQueue();
}

var printQueue = function(){
  var queue = gameLogic.turn.immediateQueue.concat(gameLogic.turn.terrainEffectsQueue.concat(gameLogic.turn.playerActionsQueue.concat(gameLogic.turn.endTurnQueue)));
  console.log("queue currently is:")
  for (var i = 0; i < queue.length; i++) {
    console.log(i, queue[i].type)
  }
}

var processQueue = function(){
  //immediate actions are things like the effects of checks
 //if there are any events in the terrainEffectsQueue, give those priority
 //else do the next player action
 //finally do endTurnQueue
 //if nothing in queues, it's the end of the turn

  //printQueue()
  if (gameLogic.turn.immediateQueue.length > 0){
    gameLogic.turn.currentEvent = gameLogic.turn.immediateQueue.shift()
   } else if (gameLogic.turn.terrainEffectsQueue.length > 0){
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

var processEvent = function(event){
  // io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic});

  var target = gameLogic.activePlayer.name;
  if (!event.target){
    event.target = target;
  }
  //EVENTUALLY ALLOW EVENTS TO TARGET OTHER PLAYERS/MONSTERS ETC

  switch(event.type){
    case "display":
      break;

    case "pain":
      //fall-through

    case "madness":
      gameLogic.affectMenace(target, event.type, event.value)
      break;
    
    case "drawExtra":
      gameLogic.incrementCardsToDraw(event.value)
      break;

    case "discard":
      for (var i = 0; i < event.value; i++) {
        gameLogic.discardCard(target, event.cardName) 
      }
      break;

    case "draw":
      for (var i = 0; i < event.value; i++) {
         gameLogic.dealCard(target)
       } 
      break;

    case "handicap":
      gameLogic.updateHandicap(event.menace, event.value)
      break;

    case "refillHand":
      gameLogic.refillHand(event.target)
      break;



    //TURN LOGIC CHECKS
    case "addDrawCardsEvent":
      gameLogic.addActionToEndTurnQueue(null, {type: "draw", value: gameLogic.turn.cardsToDraw})
      break;


    //ANYTHING WITH PLAYER INTERACTION:
    //event types with user interaction will return instead of break so that they don't have the timeout
    case "tradeMenaceForMonster":
      if (event.menace){
        gameLogic.createMonster(target, event.menace);
        gameLogic.affectMenace(target, event.menace, 2)
        break;
      }
      //else fall-through

    case "move":
      if (event.direction){
        gameLogic.movePlayer(target, event.direction);
        break;
      }
      //else fall-through
      
    case "check": 
      //fall-through

    case "choosePlayerAction":
      gameLogic.gameState = gameStates.waitingForPlayerInput;
      gameLogic.pruneActionsList()
      io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic})
      return

    case "chooseActionCard":
      gameLogic.gameState = gameStates.chooseActionCard;
      io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic});
      return;
  }

  gameLogic.gameState = gameStates.animationsPlayingOut; 

  io.sockets.emit("update gameLogic in view", {gameLogic: gameLogic})
  setTimeout(processQueue, 1000);
}


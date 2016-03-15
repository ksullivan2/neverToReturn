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

server.listen(3000, function() {
  console.log('Server is listening on port 3000');

});

//game-specific libraries------------------------------------------------------------------------------------------------------------------
var gameLogic = require("./gameLogic.js");


//SOCKET EVENTS------------------------------------------------------------------------------------------------------------------
io.on('connection', function (socket) {
	if (!socket.handshake.session.userdata){
    //tell the game we have a new player and if Player 1,2, etc.
    socket.emit("new player", {playerIndex: gameLogic.players.length+1});
  }else{
    //overwrite the socket data for that player, using cookie data
    var name = socket.handshake.session.userdata.name;
    gameLogic.resetSocket(gameLogic.lookupPlayerIndex(name),socket);
  }


  socket.on('create player', function(data){
  	var validName = gameLogic.addPlayer(data.name, socket);
    if (!validName){
      socket.emit("name taken", {playerIndex: gameLogic.players.length+1});
    } else{
      socket.handshake.session.userdata = data;
      io.sockets.emit("new player added", {players: gameLogic.players})
    }
  });


  socket.on('end turn', function(){
    gameLogic.nextTurn()
    io.sockets.emit('update active player',{activePlayerName: gameLogic.activePlayer.name})
  });

	socket.on('start game button', function(){
    	gameLogic.startGame();
    	io.sockets.emit('game started', {players: gameLogic.players, activePlayerName: gameLogic.activePlayer.name, neck:gameLogic.neck})  
	});



});

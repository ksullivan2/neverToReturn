"use strict";

var cardTypes = require("./cardTypes.js");
var Player = require("./player.js");
var gameStates = require("./gameStates.js");


var playerColors = {0: "red", 1: "blue", 2: "orange", 3:"green", 4:"purple", 5:"brown"}




function gameLogic(){
	var dummyNeck = []
	for (var i = 0; i <= 6; i++){
	    dummyNeck.push(new cardTypes.terrainCard("start"));
	  }

	this.neck = dummyNeck;
	this.players = [];
	this.activePlayer = new Player("dummyStartPlayer", 100, "yellow");
	this.gameState = gameStates.gatherPlayers;;
}




//GAMESTATE ACTIONS---------------------------------------------------------------------------------------------------------
gameLogic.prototype.startGame = function() {
	this.activePlayer = this.players[0];
	this.newNeck();
	this.gameState = gameStates.decisionMaking;
};

gameLogic.prototype.nextTurn = function() {
	var index = this.players.indexOf(this.activePlayer);

	//if we're at the end of the list, return the first player
	if (index+1 === this.players.length){
		this.activePlayer = this.players[0];
	} else{
		this.activePlayer = this.players[index+1];
	};

	this.gameState = gameStates.decisionMaking;
};

gameLogic.prototype.newNeck = function() {
	this.neck = [];
	this.neck.push(new cardTypes.terrainCard("start"));
	for (var i = 1; i <= 5; i++){
		this.neck.push(new cardTypes.terrainCard("fogRiddenSwamp"));
	}
	this.neck.push(new cardTypes.terrainCard("goal"));
};

//PLAYER ACTIONS------------------------------------------------------------------------------------------------------------------
	return (givenSocket === "/#"+ storedSocket);
}
gameLogic.prototype.movePlayerForward = function(socketID){
	console.log("movePlayerForward", socketID, this.players[0].socketID)
	for (var i = 0; i < this.players.length; i++){
			this.players[i].location += 1;
			console.log(this.players[i].name,"moved to ", this.players[i].location)
		}
	}
}



//SESSIONS/PLAYERS------------------------------------------------------------------------------------------------------------
gameLogic.prototype.addPlayer = function(name, socketID) {
	console.log("addPlayer", socketID)
	for (var i = 0; i < this.players.length; i++){
		if (this.players[i].name === name){
			return false;
		}
	}
	this.players.push(new Player(name, this.players.length+1, playerColors[this.players.length], socketID));
	return true;
};


gameLogic.prototype.resetSocket = function(name, socketID){
	for (var i = 0; i < this.players.length; i++){
		if (this.players[i].name === name){
			this.players[i].socketID = socketID
		}		
	}
}

module.exports = new gameLogic();
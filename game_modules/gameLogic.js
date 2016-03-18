"use strict";

var cardTypes = require("./cardTypes.js");
var Player = require("./player.js");
var gameStates = require("./gameStates.js");
var neckLocation = require("./neckLocation.js");


var playerColors = require("../CONFIG FILES/visualConfig.js").playerColors;




function gameLogic(){
	//create neck full of NeckLocations, plus dummy cards
	this.neck = [];
	for (var i = 0; i <= 6; i++){
		var tempLocation = new neckLocation();
		tempLocation.addCard(new cardTypes.terrainCard("start"));
		this.neck.push(tempLocation);
	}

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
	//temporary method for dealing a dummy neck
	for (var i = 0; i <= 6; i++){
		var cardName = "fogRiddenSwamp";
		if (i===0){cardName = "start"};
		if (i===6){cardName = "goal"};

		this.neck[i].cards = [];
		this.neck[i].addCard(new cardTypes.terrainCard(cardName))
	}
};

//PLAYER ACTIONS------------------------------------------------------------------------------------------------------------------

gameLogic.prototype.movePlayerForward = function(userName){
	for (var i = 0; i < this.players.length; i++){
		if (this.players[i].name === userName 
			&& this.players[i].location < this.neck.length-1){
			
			//update the neckLocations' lists of players
			this.removePlayerFromLocation(this.players[i].location, this.players[i].name);
			this.addPlayerToLocation(this.players[i].location+1, this.players[i].name);

			//update the location of the player object
			this.players[i].location += 1;
		}
	}
}

gameLogic.prototype.removePlayerFromLocation = function(locationIndex, name){
	var index = this.neck[locationIndex].playersOnLocation.indexOf(name);
	this.neck[locationIndex].playersOnLocation.splice(index, 1);
}

gameLogic.prototype.addPlayerToLocation = function(locationIndex, name){
	this.neck[locationIndex].playersOnLocation.push(name);
}



//SESSIONS/PLAYERS------------------------------------------------------------------------------------------------------------
var testForSocketMatch = function(givenSocket, storedSocket){
	return (givenSocket === "/#"+ storedSocket);
}

gameLogic.prototype.addPlayer = function(name, socketID) {
	for (var i = 0; i < this.players.length; i++){
		if (this.players[i].name === name){
			return false;
		}
	}
	var tempPlayer = new Player(name, this.players.length+1, playerColors[this.players.length], socketID);
	this.players.push(tempPlayer);
	this.addPlayerToLocation(0,tempPlayer.name);
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
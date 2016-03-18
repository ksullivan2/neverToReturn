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

	this.players = {};
	this.activePlayer = new Player("dummyStartPlayer", 100, "yellow");
	this.gameState = gameStates.gatherPlayers;;
}




//GAMESTATE ACTIONS---------------------------------------------------------------------------------------------------------
gameLogic.prototype.startGame = function() {
	var firstPlayer = this.findPlayerByOrder(0);

	this.activePlayer = firstPlayer;
	this.newNeck();
	this.gameState = gameStates.decisionMaking;
};

gameLogic.prototype.nextTurn = function() {
	var index = this.activePlayer.order;

	//if we're at the end of the list, return the first player
	if (index+1 === Object.keys(this.players).length){
		this.activePlayer = findPlayerByOrder(0);
	} else{
		this.activePlayer = findPlayerByOrder(index+1);
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

gameLogic.prototype.movePlayer = function(userName, movement){
	//move: pos is forward, neg is backward

	var player = findPlayerByUserName(userName)
	
	//update the neckLocations' lists of players
	this.removePlayerFromLocation(player.location, player.name);
	this.addPlayerToLocation(player.location+(1*movement), player.name);

	//update the location of the player object
	player.location += (1*movement);
	
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

gameLogic.prototype.findPlayerByOrder = function(order){
	for (player in this.players){
		if (player.order === order){
			return player;
		}
	}
	return false;
}

gameLogic.prototype.findPlayerByUserName = function(userName){
	return this.players[userName]
}

gameLogic.prototype.addPlayer = function(name, socketID) {
	var numPlayers = Object.keys(this.players).length;

	for (var i = 0; i < this.players.length; i++){
		if (this.players.hasOwnProperty(name)){
			return false;
		}
	}
	var tempPlayer = new Player(name, numPlayers+1, playerColors[numPlayers], socketID);
	this.players.push(tempPlayer);
	this.addPlayerToLocation(0,tempPlayer.name);
	return true;
};


gameLogic.prototype.resetSocket = function(name, socketID){
	for (var i = 0; i < Object.keys(this.players).length; i++){
		if (this.players[name].name === name){
			this.players[name].socketID = socketID
		}		
	}
}

module.exports = new gameLogic();
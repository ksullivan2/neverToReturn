"use strict";

var cardTypes = require("./cardTypes.js");
var Player = require("./player.js");

module.exports = new gameLogic();
var playerColors = {0: "red", 1: "blue", 2: "orange", 3:"green", 4:"purple", 5:"brown"}

function gameLogic(){
	this.players = [];
	this.activePlayer = null;
	this.socketList = [];
	this.neck = [];
}




//GAMESTATE ACTIONS---------------------------------------------------------------------------------------------------------
gameLogic.prototype.startGame = function() {
	this.activePlayer = this.players[0];
	this.newNeck();
};

gameLogic.prototype.nextTurn = function() {
	var index = this.players.indexOf(this.activePlayer);

	//if we're at the end of the list, return the first player
	if (index+1 === this.players.length){
		this.activePlayer = this.players[0];
	} else{
		this.activePlayer = this.players[index+1];
	};

};

//NEW NECK------------------------------------------------------------------------------------------------------------------
gameLogic.prototype.newNeck = function() {
	this.neck = [];
	this.neck.push(new cardTypes.terrainCard("start"));
	for (var i = 1; i <= 5; i++){
		this.neck.push(new cardTypes.terrainCard("fogRiddenSwamp"));
	}
	this.neck.push(new cardTypes.terrainCard("goal"));
};


//SESSIONS/PLAYERS------------------------------------------------------------------------------------------------------------
gameLogic.prototype.addPlayer = function(name, socket) {
	//passing sockets back and forth breaks things. 
	//we will figure out the socket/player relationship by the index.
	for (var i = 0; i < this.players.length; i++){
		if (this.players[i].name === name){
			return false;
		}
	}

	this.players.push(new Player(name, this.players.length+1, playerColors[this.players.length]));
	this.socketList.push(socket);
	return true;
};


gameLogic.prototype.lookupPlayerIndex= function(name){
	for (var i = 0; i < this.players.length; i++){
		if (this.players[i].name === name){
			return i;
		}
	}
	return false;
}

gameLogic.prototype.resetSocket = function(playerIndex, socket){
	this.socketList[playerIndex] = socket;
}
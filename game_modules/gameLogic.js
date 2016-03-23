"use strict";

var cardTypes = require("./cardTypes.js");
var Player = require("./player.js");
var gameStates = require("./gameStates.js");
var neckLocation = require("./neckLocation.js");

//CONFIG FILE IMPORTS
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
	this.activePlayer = new Player("dummyStartPlayer");
	this.gameState = gameStates.gatherPlayers;
	this.turn = null;

}



//GAMEPLAY ACTIONS---------------------------------------------------------------------------------------------------------
gameLogic.prototype.initializeGame = function() {
	//SHOULD ONLY DO ACTIONS UNIQUE TO STARTING GAME

	//set the first player (eventually, ask for who goes first)
	var firstPlayer = this.findPlayerByOrder(0);
	this.activePlayer = firstPlayer;

	//eventually, people will choose the neck cards
	this.newNeck();

	//deal action cards to each player
	for (var i in this.players){
		this.assignPlayerCard(this.players[i], "homelyVillager")
		this.replenishHand(this.players[i])
	}

	
	//the server will handle the "new turn" command
};

gameLogic.prototype.assignPlayerCard = function(player, cardName){
	player.card = new cardTypes.playerCard(cardName)

	//initialize stats
	player.pain = player.card.pain;
	player.madness = player.card.madness;
}


gameLogic.prototype.changeActivePlayer = function(){
	var index = this.activePlayer.order;

	//if we're at the end of the list, return the first player
	if (index+1 === Object.keys(this.players).length){
		this.activePlayer = this.findPlayerByOrder(0);
	} else{
		this.activePlayer = this.findPlayerByOrder(index+1);
	};
}

gameLogic.prototype.newNeck = function() {
	//temporary method for dealing a dummy neck
	var cardNames = ["start","verdantClearing","bloodiedThickets","shadowyVale","sobbingWillowWood","fogRiddenSwamp","goal"];

	for (var i = 0; i < cardNames.length; i++){
		this.neck[i].cards = [];
		this.neck[i].addCard(new cardTypes.terrainCard(cardNames[i]))
	}
};

//TURNS-------------------------------------------------------------------------------------------------
function Turn(){
  //these arrays will be filled with objects/events to fire and will always be resolved in order
  this.terrainEffectsQueue = ["desperationCheck"];
  this.playerActionsQueue = ["choosePlayerAction"];
  this.endTurnQueue = ["checkForLostPlayers","drawCard"]
  this.numberOfActions = 1;
  this.playedActionCard = false;
}

gameLogic.prototype.initializeTurn = function(){
	this.turn = new Turn();
	this.collectTurnStartEffects();
}


gameLogic.prototype.collectTurnStartEffects = function(){
	//for comprehension's sake, save a reference to the cards on the current active location
	var cardsOnLocation = this.neck[this.activePlayer.location].cards;

	//create a list of all the effects of all of the cards
	for (var i = 0; i < cardsOnLocation.length; i++) {
		 this.turn.terrainEffectsQueue = this.turn.terrainEffectsQueue.concat(cardsOnLocation[i].onTurnStart)
	}
}

gameLogic.prototype.collectOnEncounterEffects = function(){
	//for comprehension's sake, save a reference to the cards on the current active location
	var cardsOnLocation = this.neck[this.activePlayer.location].cards;

	//create a list of all the effects of all of the cards
	for (var i = 0; i < cardsOnLocation.length; i++) {
		this.turn.terrainEffectsQueue = this.turn.terrainEffectsQueue.concat(cardsOnLocation[i].onEncounter)
	}
}



//PLAYER ACTIONS------------------------------------------------------------------------------------------------------------------

gameLogic.prototype.movePlayer = function(userName, movement){
	//move: pos is forward, neg is backward

	var player = this.findPlayerByUserName(userName)
	
	//update the neckLocations' lists of players
	this.removePlayerFromLocation(player.location, player.name);
	this.addPlayerToLocation(player.location+(1*movement), player.name);

	//update the location of the player object
	player.location += (1*movement);

	this.collectOnEncounterEffects();
}

gameLogic.prototype.removePlayerFromLocation = function(locationIndex, name){
	var index = this.neck[locationIndex].playersOnLocation.indexOf(name);
	this.neck[locationIndex].playersOnLocation.splice(index, 1);
}

gameLogic.prototype.addPlayerToLocation = function(locationIndex, name){
	this.neck[locationIndex].playersOnLocation.push(name);
}

gameLogic.prototype.replenishHand = function(player){
	//DUMMY METHOD FOR LIMITED ASSETS
	player.hand = [new cardTypes.actionCard("cannibalism"),
	new cardTypes.actionCard("endlessMeander"),
	new cardTypes.actionCard("filthyWateringHole"),
	new cardTypes.actionCard("questionableFlensing"),
	new cardTypes.actionCard("recklessSprint")]

	//ACTUAL METHOD:
	// while (player.hand.length < 5){
	// 	this.dealCard(player)
	// }
}

gameLogic.prototype.dealCard = function(player){
	player.hand.push(new cardTypes.actionCard("cannibalism"))
	//remove card from deck when I create the deck...
}


//SESSIONS/SOCKETS------------------------------------------------------------------------------------------------------------
var testForSocketMatch = function(givenSocket, storedSocket){
	return (givenSocket === "/#"+ storedSocket);
}

gameLogic.prototype.findPlayerByOrder = function(order){
	for (var i in this.players){
		if (this.players[i].order === order){
			return this.players[i];
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
	var tempPlayer = new Player(name, numPlayers, playerColors[numPlayers], socketID);
	this.players[tempPlayer.name] = tempPlayer;
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

module.exports = gameLogic;
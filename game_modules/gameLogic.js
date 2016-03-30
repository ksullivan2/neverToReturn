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
	var cardNames = ["start","shadowyVale","sobbingWillowWood","verdantClearing","bloodiedThickets","fogRiddenSwamp","goal"];

	for (var i = 0; i < cardNames.length; i++){
		this.neck[i].cards = [];
		this.neck[i].addCard(new cardTypes.terrainCard(cardNames[i]))
	}
};

gameLogic.prototype.isCheckPassed = function(target, menace, dice){
	var player = this.findPlayerByUserName(target)
	var value = player[menace]
	//ADD ALL THE BONUSES THEY GET (STORED IN TURN)

	if (dice <= value){
		return true;
	}
	return false;
}

//TURNS/QUEUES-----------------------------------------------------------------------------------------------

const MOVE_FORWARD = "Move Forward"
const MOVE_BACKWARD = "Move Backward"
const ROLL_CHECK = "Roll Check"
const DISCARD_FOR_BONUS = "Discard For Bonus"
const OPTION_1 = "Option 1"
const OPTION_2 = "Option 2"


const STANDARD_ACTIONS = [MOVE_FORWARD,MOVE_BACKWARD];
const CHECK_ACTIONS = [ROLL_CHECK, DISCARD_FOR_BONUS];
const CARD_CHOICE = [OPTION_1, OPTION_2]

function Turn(activePlayer){
	//filter standard actions list if the player is on first or last space
	var standardActions = STANDARD_ACTIONS
	if (activePlayer.location === 0){
		var standardActions = standardActions.filter(function(action){return (action !== MOVE_BACKWARD)})
	} else if (activePlayer.location === 6){
		var standardActions = standardActions.filter(function(action){return (action !== MOVE_FORWARD)})
	}


  this.currentEvent = null;
  //these arrays will be filled with objects/events to fire and will always be resolved in order
  this.terrainEffectsQueue = [{type: "desperationCheck"}];
  this.playerActionsQueue = [{type: "choosePlayerAction", actionList: standardActions}];
  this.endTurnQueue = [{type: "checkForLostPlayers"},{type:"checkIfPlayedActionCard"}]

  //these are various stat effects and checks per turn
  this.numberOfActions = 1;
  this.madnessHandicap = 0;
  this.painHandicap = 0;
  this.playedActionCard = false;
  this.stopped = false;
}

gameLogic.prototype.initializeTurn = function(){
	this.turn = new Turn(this.activePlayer);
	this.collectTurnStartEffects();
}

gameLogic.prototype.decrementTurnActions = function(){
	this.turn.numberOfActions -= 1
}

gameLogic.prototype.collectTurnStartEffects = function(){
	var self = this;

	//for comprehension's sake, save a reference to the cards on the current active location
	var cardsOnLocation = this.neck[this.activePlayer.location].cards;


	cardsOnLocation.forEach(function(card){
		card.onTurnStart.forEach(function(event){
			self.addActionToTerrainQueue(card.name, event)
		})
	})
}

gameLogic.prototype.collectOnEncounterEffects = function(){
	var self = this;
	//for comprehension's sake, save a reference to the cards on the current active location
	var cardsOnLocation = this.neck[this.activePlayer.location].cards;

	//create a list of all the effects of all of the cards
	cardsOnLocation.forEach(function(card){
		card.onEncounter.forEach(function(event){
			self.addActionToTerrainQueue(card.name, event)
		})
	})
}

gameLogic.prototype.addActionToTerrainQueue = function(source, event){
	this.preprocessEvent(source,event)
	this.turn.terrainEffectsQueue.push(event)
}

gameLogic.prototype.addActionToPlayerActionsQueue = function(source, event){
	this.preprocessEvent(source,event)
	this.turn.playerActionsQueue.push(event)
}

gameLogic.prototype.addActionToEndTurnQueue = function(source, event){
	this.preprocessEvent(source,event)
	this.turn.endTurnQueue.push(event)
}

gameLogic.prototype.preprocessEvent = function(source, event){
	if (event.type === "check"){
		event.actionList = CHECK_ACTIONS
	}

	event.source = source
}



//PLAYER ACTIONS IN GAME--------------------------------------------------------------------------------------

gameLogic.prototype.affectMenace = function(userName, menace, value) {
	var player = this.findPlayerByUserName(userName)
	player[menace] += value

	//adjust for going out of bounds
	if (player[menace] > player.card[menace]){
		player[menace] = player.card[menace]
	}
	if (player[menace] < 0){
		player[menace] = 0;
	}
};



//MOVING---------------------------------------
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

//CARDS---------------------------------------
gameLogic.prototype.replenishHand = function(player){
	//DUMMY METHOD FOR LIMITED ASSETS
	player.hand = [new cardTypes.actionCard("cannibalism"),
	new cardTypes.actionCard("filthyWateringHole"),
	new cardTypes.actionCard("questionableFlensing"),
	new cardTypes.actionCard("recklessSprint"),
	new cardTypes.actionCard("endlessMeander")]

	//ACTUAL METHOD:
	// while (player.hand.length < 5){
	// 	this.dealCard(player)
	// }
}

gameLogic.prototype.discardCard = function(userName, index){
	var player = this.findPlayerByUserName(userName)
	
	if (player.hand.length ===0){
		return false;
	}

	//could be random OR NOT
	if (!index){
		index = Math.floor(Math.random()*player.hand.length)
	}

	player.hand.splice(index, 1)
	//RETURN CARD TO DECK LATER!!! (splice returns removed element)
}

gameLogic.prototype.dealCard = function(userName){
	var player = this.findPlayerByUserName(userName)

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
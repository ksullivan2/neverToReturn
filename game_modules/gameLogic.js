"use strict";


var cardTypes = require("./cardTypes.js");
var Player = require("./player.js");
var gameStates = require("./gameStates.js");
var neckLocation = require("./neckLocation.js");

//CONFIG FILE IMPORTS
const PLAYER_COLORS = require("../CONFIG FILES/visualConfig.js").playerColors;
const STANDARD_PLAYER_ACTIONS = require("../CONFIG FILES/gamePlayConfig.js").standardPlayerActions;
const TURN_ACTIONS = require("../CONFIG FILES/gamePlayConfig.js").turnActions;



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
		this.refillHand(this.players[i].name)
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
	var value = player[menace] + this.turn.handicaps[menace]

	if (dice <= value){
		return true;
	}
	return false;
}

//TURNS/QUEUES-----------------------------------------------------------------------------------------------
const ROLL_CHECK = {buttonText: "Roll Check"}
const DISCARD_FOR_BONUS = {buttonText: "Discard For Bonus"}

const PAIN = {buttonText: "Pain"}
const MADNESS = {buttonText: "Madness"}

const CHECK_ACTIONS = [ROLL_CHECK, DISCARD_FOR_BONUS];
const MENACE_TYPES = [PAIN, MADNESS]

function Turn(){
  this.currentEvent = null;
  //these arrays will be filled with objects/events to fire and will always be resolved in order
  this.immediateQueue = [];
  this.terrainEffectsQueue = [];
  this.playerActionsQueue = [];
  this.endTurnQueue = [];

  //these are various effects and checks per turn
  this.numberOfActions = 1;
  this.handicaps = {pain: 0, madness: 0}
  this.cardsToDraw = 0;
  this.stopped = false;
}


gameLogic.prototype.initializeTurn = function(){
	this.turn = new Turn();
	this.parseTurnActionsConfig();
	this.collectTurnStartEffects();
}

gameLogic.prototype.parseTurnActionsConfig = function(first_argument) {
	var self = this;

	TURN_ACTIONS.immediate.forEach(function(event){
		self.addActionToImmediateQueue(null, event)
	})
	TURN_ACTIONS.terrain.forEach(function(event){
		self.addActionToTerrainQueue(null, event)
	})
	TURN_ACTIONS.playerActions.forEach(function(event){
		self.addActionToPlayerActionsQueue(null, event)
	})
	TURN_ACTIONS.endTurn.forEach(function(event){
		self.addActionToEndTurnQueue(null, event)
	})
};

gameLogic.prototype.decrementTurnActions = function(){
	this.turn.numberOfActions -= 1
}

gameLogic.prototype.incrementTurnActions = function(number) {
	this.turn.numberOfActions += number
};

gameLogic.prototype.incrementCardsToDraw = function(number){
	this.turn.cardsToDraw += number
	if (this.turn.cardsToDraw < 0){
		this.turn.cardsToDraw = 0
	}
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

gameLogic.prototype.addActionToTerrainQueue = function(source, originalEvent){
	var event = this.preprocessEvent(source,originalEvent)
	this.turn.terrainEffectsQueue.push(event)
}

gameLogic.prototype.addActionToPlayerActionsQueue = function(source, originalEvent){
	var event = this.preprocessEvent(source,originalEvent)
	this.turn.playerActionsQueue.push(event)
}

gameLogic.prototype.addActionToEndTurnQueue = function(source, originalEvent){
	var event = this.preprocessEvent(source,originalEvent)
	this.turn.endTurnQueue.push(event)
}

gameLogic.prototype.addActionToImmediateQueue = function(source, originalEvent){
	var event = this.preprocessEvent(source,originalEvent)
	this.turn.immediateQueue.push(event)
}


gameLogic.prototype.preprocessEvent = function(source, originalEvent){
	//to avoid passing around references to the same objects (since we will be editing these objects later)
	//we create a new event object each time

	
	var event = (JSON.parse(JSON.stringify(originalEvent)));
	

	event.source = source

	if (!event.actionList){
		event.actionList = [];
	}

	switch (event.type){
		case "choosePlayerAction":
			for (var action in STANDARD_PLAYER_ACTIONS){
				event.actionList.push({buttonText: STANDARD_PLAYER_ACTIONS[action].buttonText})
			}
			break;

		case "check":
			event.actionList = CHECK_ACTIONS
			break;

		case "move":
			event.actionList = [STANDARD_PLAYER_ACTIONS.MOVE_FORWARD, STANDARD_PLAYER_ACTIONS.MOVE_BACKWARD]
			break;

		case "tradeMenaceForMonster":
			event.actionList = MENACE_TYPES
			break;

	} 

	return event;
	
}

gameLogic.prototype.pruneActionsList = function() {
	var self = this;
	
	var filterAction = function(actionToFilter) {
		self.turn.currentEvent.actionList = self.turn.currentEvent.actionList.filter(function(action){
		return (action.buttonText !== actionToFilter.buttonText)})
	}

	//check if there are cards left in their hand
	if (this.activePlayer.hand.length === 0){
		filterAction(DISCARD_FOR_BONUS)
		filterAction(STANDARD_PLAYER_ACTIONS.ACTION_CARD)
		filterAction(STANDARD_PLAYER_ACTIONS.DISCARD_AND_DRAW)
	}

	if (this.activePlayer.hand.length >= 5){
		filterAction(STANDARD_PLAYER_ACTIONS.REFILL_HAND)
	}

	//check if they're at either end of the neck
	if (this.activePlayer.location === 0){
		filterAction(STANDARD_PLAYER_ACTIONS.MOVE_BACKWARD)
	} else if (this.activePlayer.location === 6){
		filterAction(STANDARD_PLAYER_ACTIONS.MOVE_FORWARD)
	}

	//check if there is enough damage to menace to create a monster
	if (this.activePlayer.pain === this.activePlayer.card.pain && this.activePlayer.madness === this.activePlayer.card.madness){
		filterAction(STANDARD_PLAYER_ACTIONS.TRADE_MENACE_FOR_MONSTER)
	}

	if (this.turn.currentEvent.type === "tradeMenaceForMonster"){
		if (this.activePlayer.pain === this.activePlayer.card.pain){
			filterAction(PAIN)
		}
		if (this.activePlayer.madness === this.activePlayer.card.madness){
			filterAction(MADNESS)
		}
	}

	//ADD PLAYER-SPECIFIC ACTIONS HERE

};




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

gameLogic.prototype.updateHandicap = function(menace, value){
	this.turn.handicaps[menace] += value
}



//MOVING---------------------------------------
gameLogic.prototype.movePlayer = function(userName, direction){
	if (direction == "forward"){
		var directionKey = 1
	} else if (direction == "backward"){
		var directionKey = -1
	} else {
		console.log("INVALID DIRECTION IN MOVEPLAYER")
		return
	}

	var player = this.findPlayerByUserName(userName)
	
	//update the neckLocations' lists of players
	this.removePlayerFromLocation(player.location, player.name);
	this.addPlayerToLocation(player.location+(1*directionKey), player.name);

	//update the location of the player object
	player.location += (1*directionKey);

	this.collectOnEncounterEffects();
}

gameLogic.prototype.removePlayerFromLocation = function(locationIndex, name){
	var index = this.neck[locationIndex].playersOnLocation.indexOf(name);
	this.neck[locationIndex].playersOnLocation.splice(index, 1);
}

gameLogic.prototype.addPlayerToLocation = function(locationIndex, name){
	this.neck[locationIndex].playersOnLocation.push(name);
}

//ACTION CARDS---------------------------------------
gameLogic.prototype.refillHand = function(userName){
	//DUMMY METHOD FOR LIMITED ASSETS
	var player = this.findPlayerByUserName(userName)

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

gameLogic.prototype.discardCard = function(userName, cardName){
	var player = this.findPlayerByUserName(userName)

	
	if (player.hand.length ===0){
		return false;
	}

	//could be random OR NOT
	if (cardName){
		for (var i = 0; i < player.hand.length; i++) {
			if (player.hand[i].name === cardName){
				var index = i
				break;
			}
		}
	} else{
		var index = Math.floor(Math.random()*player.hand.length)
	}

	player.hand.splice(index, 1)
	//RETURN CARD TO DECK LATER!!! (splice returns removed element)
}

gameLogic.prototype.dealCard = function(userName){
	var player = this.findPlayerByUserName(userName)

	player.hand.push(new cardTypes.actionCard("endlessMeander"))
	//remove card from deck when I create the deck...
}

//MONSTERS------------------------------------------------------------------------------------------------------------
gameLogic.prototype.createMonster = function(userName, menace) {
	var self = this;
	// temporarily always creates monster in same space

	if (menace === "pain"){
		var card = new cardTypes.monsterCard("burrowingFlies")
	} else if (menace === "madness"){
		var card = new cardTypes.monsterCard("laughingSpectre")
	} else {
		console.log("createMonster had an invalid type")
	}

	var player = this.findPlayerByUserName(userName)

	this.neck[player.location].addCard(card)

	card.onEncounter.forEach(function(event){
		self.addActionToTerrainQueue(card.name, event)
	})
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
	var tempPlayer = new Player(name, numPlayers, PLAYER_COLORS[numPlayers], socketID);
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
module.exports = {terrainCard, monsterCard, playerCard, actionCard}


//check types: none, pain, madness, either, safest 

//need to account for special values, like (for each player on space)
//valueMultipliers: playersOnSpace, cardsInHand


function terrainCard(name){
	var config = require("../CONFIG FILES/cardConfigs/terrainCards/"+name+".json")
	
	this.name = name;
	this.imgSRC = "assets/terrainCards/"+name+".jpg";

	this.onEncounter = config.onEncounter;
	this.onTurnStart = config.onTurnStart;

	//keeps track of if card has been revealed yet
	this.isRevealed = false;
}


function monsterCard(name){
	var config = require("../CONFIG FILES/cardConfigs/monsterCards/"+name+".json")

	this.name = name;
	this.imgSRC = "assets/monsterCards/"+name+".jpg";
	this.menace = config.menace;
	this.hitPoints = config.hitPoints;
	
	this.onEncounter = config.onEncounter;
	this.onTurnStart = config.onTurnStart;
		
	//keeps track of if card has been revealed yet
	this.isRevealed = false;
}
 
function playerCard(name){
	this.name = name;
	this.pain = 6;
	this.madness = 6;
	this.specialAbility = "aMomentsRespite"
	this.imgSRC = "assets/playerCards/"+name+".jpg";
}

function actionCard(name){
	var config = require("../CONFIG FILES/cardConfigs/actionCards/"+name+".json")

	this.name = name;
	this.imgSRC = "assets/actionCards/"+name+".jpg";
	
	this.actions = config.actions;
}
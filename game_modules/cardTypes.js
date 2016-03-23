module.exports = {terrainCard, monsterCard, playerCard, actionCard}


//check types: none, pain, madness, either, safest 

//need to account for special values, like (for each player on space)
//valueMultipliers: playersOnSpace, cardsInHand


function terrainCard(name){
	//TO DO: figure out a way to send the name of the card with every event
	var config = require("../CONFIG FILES/cardConfigs/terrainCards/"+name+".json")
	

	this.name = name;
	this.imgSRC = "assets/terrainCards/"+name+".jpg";

	this.onEncounter = config.onEncounter;
	this.onTurnStart = config.onTurnStart;

	//keeps track of if card has been revealed yet
	this.isRevealed = false;
}


function monsterCard(){
	this.name = "";
	this.imgSRC = "";
	this.type = "madness";
	this.hitPoints = 2;
	
	this.onEncounter = [];
	this.onTurnStart = [];
		
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
	this.name = name;
	this.imgSRC = "assets/actionCards/"+name+".jpg";
}
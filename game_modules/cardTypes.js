module.exports = {terrainCard, monsterCard, playerCard, actionCard}


//check types: none, pain, madness, either, safest 

//need to account for special values, like (for each player on space)
//valueMultipliers: playersOnSpace, cardsInHand


function terrainCard(name){
	//TO DO: figure out a way to send the name of the card with every event
	this.name = name;
	this.imgSRC = "assets/terrainCards/"+name+".jpg";

	//effects will be generated from csv or something like it
	this.onEncounter = ["effect1", "effect2"];
	this.onTurnStart = ["effect1", "effect2"];

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
 
function playerCard(){
	this.name = "";
	this.painPoints = 5;
	this.madnessPoints = 6;
	this.specialAbility = ""
}

function actionCard(name){
	this.name = name;
	this.imgSRC = "assets/actionCards/"+name+".jpg";
}
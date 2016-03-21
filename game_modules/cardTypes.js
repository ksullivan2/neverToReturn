module.exports = {terrainCard, monsterCard, playerCard, actionCard}


//check types: none, pain, madness, either, safest 

//need to account for special values, like (for each player on space)
//valueMultipliers: playersOnSpace, cardsInHand


function terrainCard(name){
	this.name = name;
	this.onEncounter = [
		"effect1", "effect2"
	];
	

	this.onTurnStart = ["effect1", "effect2"];

	this.imgSRC = "assets/terrainCards/"+name+".jpg";
}


function monsterCard(){
	this.name = "";
	this.imgSRC = "";
	
	this.onEncounter = {
		check: {type: "madness", exists: true},
		checkReducesHitPoints: true,
		effect: {type: "madness", value: -2, stop: true}
	};
	this.onTurnStart = {
		check: {type: "madness", exists: true},
		checkReducesHitPoints: false,
		effect: {type: "madness", value: -2, stop: true}
	};

	this.type = "m";
	this.hitPoints = 2;
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
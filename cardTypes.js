module.exports = {terrainCard, monsterCard, playerCard}

function terrainCard(name){
	this.name = name;
	this.onEncounter = {
		check: {type: "pain", exists: true},
		effect: {type: "pain", value: -2, stop: true}
	};
	this.onTurnStart = {
		check: {type: "pain", exists: true},
		effect: {type: "pain", value: -2, stop: true}
	};

	this.imgSRC = "assets/terrainCards/"+name+".jpg";
}

function monsterCard(){
	this.name = "";
	this.imageSRC = "";
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
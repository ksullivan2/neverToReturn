module.exports = Player;


function Player(name, order, color, socketID){
	this.socketID = socketID;

	this.name = name;
	this.color = color;
	this.hand = [];

	//stats
	this.card = null;
	this.pain = 0;
	this.madness = 0;
	this.progress = 0;

	//location is 0-7; it is the current space the player is on
	this.location = 0;

	//player order is the order in which the players were added. It is used for keeping track of turn.
	this.order = order;
}
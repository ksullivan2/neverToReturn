module.exports = Player;


function Player(name, number, color, socketID){
	this.socketID = socketID;

	this.name = name;
	this.color = color;

	//location is 0-7; it is the current space the player is on
	this.location = 0;

	//player number is the position in the players array +1. It is used to link a player to its DOM element.
	this.number = number;
}
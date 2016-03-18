var cardTypes = require("./cardTypes.js");


function neckLocation(){
	this.playersOnLocation = [];
	this.cards = [];
}

neckLocation.prototype.addCard = function(card) {
	this.cards.push(card)
};


module.exports = neckLocation;
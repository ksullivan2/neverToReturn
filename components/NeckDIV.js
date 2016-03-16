var React = require('react');
var LocationDIV = require('./LocationDIV');
var PlayerPiece = require('./PlayerPiece');
var socket = io();



var NeckDIV = React.createClass({
  render: function () {
    var self = this;

    //creating an array to be rendered below
    var cardsInNeck = [];
    for (var i = 0; i < this.props.neck.length; i++){

      //create the list of players that is on that card
      var playersOnLocation = [];
      for (var j = 0; j < this.props.players.length; j++){
          
        //if the player's location is the current card:
        if (this.props.players[j].location == i){
          //it's j+1 for human-readable names, starting with player 1
          var playerkey = "player" + (j+1);
          var active = false;
          if (self.props.activePlayer === this.props.players[j].name){active = true;}
          playersOnLocation.push({player:this.props.players[j], key:playerkey, active:active})
        }
      }

      cardsInNeck.push({card: this.props.neck[i], cardkey:("card"+i), playersOnLocation:playersOnLocation})
    }


    return (
      <div  className="layoutDIV" id='NeckDIV'>
        <div id="allCardsDIV" className="layoutDIV">
          {cardsInNeck.map(function(eachCard){
            return <LocationDIV card={eachCard.card} 
                                key={eachCard.cardkey} 
                                name={eachCard.cardkey} 
                                players={eachCard.playersOnLocation} />
          })}
        </div>
      </div>
    )
  }
});

module.exports = NeckDIV;



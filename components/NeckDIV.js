var React = require('react');
var LocationDIV = require('./LocationDIV');
var PlayerPiece = require('./PlayerPiece');
var NeckCanvas = require('./NeckCanvas')
var socket = io();



var NeckDIV = React.createClass({
  

  render: function () {
    

    var self = this;

    //creating an array to be rendered below
    var cardsInNeck = [];
    for (var i = 0; i < this.props.neck.length; i++){
      cardsInNeck.push({card: this.props.neck[i], cardkey:("card"+i)})
    }


    return (
      <div  className="layoutDIV" id='NeckDIV'>
        <NeckCanvas players={this.props.players} activePlayer={this.props.activePlayer}/>
        

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



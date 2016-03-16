var React = require('react');
var LocationDIV = require('./LocationDIV');
var PlayerPiece = require('./PlayerPiece');
var cardTypes = require("../cardTypes.js");
var socket = io();

var dummyNeck =[]
for (var i = 0; i <= 6; i++){
    dummyNeck.push(new cardTypes.terrainCard("start"));
  }

var NeckDIV = React.createClass({
  getInitialState: function(){
    return {neck: dummyNeck};
  },

  componentDidMount(){
    self = this;
    socket.on("game started", this.__gameStarted);
  },

  __gameStarted(data){
    this.updateNeck(data);
    
  },

  updateNeck(data) {
    this.setState({neck: data.neck});
  },

  

  render: function () {
    var cardsInNeck = this.state.neck.map(function(card){
      return <LocationDIV card={card} />
    })

    var playersInGame = this.props.players.map(function(player){
      return <PlayerPiece player={player} />
    })

    return (
      <div  className="layoutDIV" id='NeckDIV'>
        <div id="allCardsDIV" className="layoutDIV">
          {playersInGame}
          {cardsInNeck}
        </div>
      </div>
    )
  }
});

module.exports = NeckDIV;



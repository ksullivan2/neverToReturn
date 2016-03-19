var React = require('react');
var PlayerDIV = require('./PlayerDIV');
var ChatDIV = require('./ChatDIV');
var socket = io();


// props are:
//   players: {playerName: Player}
//   userName: ""
//   activePlayer: Player

var OpponentsDIV = React.createClass({
  render: function () {
    var self = this;

  	var playerList = []

    for (var i in this.props.players){
  		var key = "playerDIV"+ this.props.players[i].name;
      var active = false;
        if (self.props.activePlayer.name === this.props.players[i].name){active = true;}
  		playerList.push({player:this.props.players[i], active:active, key: key})
  	};

    return (
      <div  className="layoutDIV" id='OpponentsDIV'>
        You are: {this.props.userName}
        {playerList.map(function(eachPlayer){
          return(
            <PlayerDIV player={eachPlayer.player} key={eachPlayer.key} active={eachPlayer.active}/>
          )
        })}
        <ChatDIV />
      </div>
    )
  }
});

module.exports = OpponentsDIV;



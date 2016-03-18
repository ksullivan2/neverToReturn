var React = require('react');
var PlayerDIV = require('./PlayerDIV');
var ChatDIV = require('./ChatDIV');
var socket = io();




var OpponentsDIV = React.createClass({
  render: function () {
    var self = this;

  	var playerList = []

    for (player in this.props.players){
  		var key = "playerDIV"+ player.name;
      var active = false;
        if (self.props.activePlayer.name === player.name){active = true;}
  		playerList.push({player:player, active:active, key: key})
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



var React = require('react');
var PlayerDIV = require('./PlayerDIV');
var ChatDIV = require('./ChatDIV');
var socket = io();




var OpponentsDIV = React.createClass({
  render: function () {
    var self = this;

  	var playerList = this.props.players.map(function(player){
  		var key = "playerDIV"+ player.name;
      var active = false;
      if (self.props.activePlayer.name === player.name){active = true;}
  		return <PlayerDIV player={player} key={key} active={active}/>
  	});

    return (
      <div  className="layoutDIV" id='OpponentsDIV'>
        You are: {this.props.userName}
        {playerList}
        <ChatDIV />
      </div>
    )
  }
});

module.exports = OpponentsDIV;



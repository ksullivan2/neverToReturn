var React = require('react');
var PlayerDIV = require('./PlayerDIV');
var ChatDIV = require('./ChatDIV');
var socket = io();




var OpponentsDIV = React.createClass({
  render: function () {
    self = this;

  	var playerList = this.props.players.map(function(player){
  		var key = "playerDIV"+ player.name;
      var active = false;
      if (self.props.activePlayer && self.props.activePlayer.name === player.name){
        active = true;
      };
  		return <PlayerDIV player={player} key={key} active={active}/>
  	});

    return (
      <div  className="layoutDIV" id='OpponentsDIV'>
        OpponentsDIV
        {playerList}
        <ChatDIV />
      </div>
    )
  }
});

module.exports = OpponentsDIV;



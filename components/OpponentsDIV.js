var React = require('react');
var PlayerDIV = require('./PlayerDIV');
var ChatDIV = require('./ChatDIV');
var socket = io();




var OpponentsDIV = React.createClass({
  render: function () {

  	var playerList = this.props.players.map(function(player){
  		var key = "player"+ player.name;
  		return <PlayerDIV name={player.name} key={key} />
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



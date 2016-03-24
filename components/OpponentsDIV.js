var React = require('react');
var PlayerDIV = require('./PlayerDIV');
var ChatDIV = require('./ChatDIV');
var socket = io();


// props are:
//   players: {playerName: Player}
//   userName: ""
//   activePlayer: Player

var OpponentsDIV = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState){

    //update if the active player changes
    if (nextProps.activePlayer.name != this.props.activePlayer.name){
      console.log("OpponentsDIV rendering because activePlayer changed")
      return true;
    }

    //if someone joins the game
    if (Object.keys(this.props.players).length != Object.keys(nextProps.players).length){
      console.log("OpponentsDIV rendering because someone joined the game")
      return true;
    }

    //if someone's stats change
    for (var i in nextProps.players) {
      if (nextProps.players[i].pain != this.props.players[i].pain 
        || nextProps.players[i].madness != this.props.players[i].madness
        || nextProps.players[i].progress != this.props.players[i].progress)
      {
        return true;
      }
    }

    return false;
  },


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



var React = require('react');
var $ = require('jquery');
var gameStates = require('../game_modules/gameStates.js');
var ActionButton = require('./ActionButton.js')


//props are:
//   gameState: int(enum)
//   userName: ""
//   activePlayer: Player


// gameStates enum:
//   gatherPlayers: 0,
//   decisionMaking: 1,
//   actionsPlayingOut: 2

var ActionAREA = React.createClass({
	
  render: function () {
    var displayNotYourTurn = "block";
    var displayStart = false;
    var displayEndTurn = false;
    var displayMoveForward = false;
    var displayMoveBackward = false;

  	if (this.props.gameState === gameStates.gatherPlayers){
      displayStart = true;
    }
    else if (this.props.gameState === gameStates.decisionMaking){
      if (this.props.activePlayer.name == this.props.userName){
        displayNotYourTurn = "none";
        displayEndTurn = true;

        if (this.props.activePlayer.location != 6){
          displayMoveForward = true;
        }
        if (this.props.activePlayer.location != 0){
          displayMoveBackward = true;
        }
      }
    }
    else if (this.props.gameState === gameStates.gatherPlayers){

    }


    return (
      <div className="layoutDIV" id='ActionAREA'>
        <h2 style={{display:displayNotYourTurn}}> It is not currently your turn</h2>
        <ActionButton text="Start Game" display={displayStart} userName={this.props.userName}/>
		    <ActionButton text="End Turn" display={displayEndTurn} userName={this.props.userName}/>
        <ActionButton text="Move Forward" display={displayMoveForward} userName={this.props.userName}/>
        <ActionButton text="Move Backward" display={displayMoveBackward} userName={this.props.userName}/>

      </div>
    )
  }
});

module.exports = ActionAREA;



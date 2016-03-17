var React = require('react');
var $ = require('jquery');
var socket = io();
var gameStates = require('../game_modules/gameStates.js');
var ActionButton = require('./ActionButton.js')


//REACT CLASS

// gameStates:
//   gatherPlayers: 0,
//   decisionMaking: 1,
//   actionsPlayingOut: 2

var ActionAREA = React.createClass({
	
  render: function () {
    var displayStart = false;
    var displayEndTurn = false;
    var displayMoveOneSpace = false;

  	if (this.props.gameState === gameStates.gatherPlayers){
      displayStart = true;
    }
    else if (this.props.gameState === gameStates.decisionMaking){
      displayMoveOneSpace = true;
      displayEndTurn = true;
    }
    else if (this.props.gameState === gameStates.gatherPlayers){

    }


    return (
      <div className="layoutDIV" id='ActionAREA'>
        <p>ActionAREA</p>
        <ActionButton text="Start Game" display={displayStart}/>
		    <ActionButton text="End Turn" display={displayEndTurn}/>
        <ActionButton text="Move One" display={displayMoveOneSpace} />
      </div>
    )
  }
});

module.exports = ActionAREA;



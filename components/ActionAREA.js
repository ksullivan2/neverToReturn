var React = require('react');
var $ = require('jquery');
var gameStates = require('../game_modules/gameStates.js');
var ActionButton = require('./ActionButton.js')


//props are:
//   gameState: int(enum)
//   userName: ""
//   activePlayer: Player
//   turn: Turn


// gameStates enum:
//   gatherPlayers: 0,
//   decisionMaking: 1,
//   actionsPlayingOut: 2

var ActionAREA = React.createClass({
	
  render: function () {
    

    var displayStart = false;
    var displayMoveForward = false;
    var displayMoveBackward = false;
    var displayRollCheck = false;

    var actionText = ""


  	if (this.props.gameState === gameStates.gatherPlayers){
      displayStart = true;
      actionText = "Waiting for all players to join..."
    }
    else if (this.props.gameState === gameStates.waitingForPlayerInput){
      
      actionText = "It is "+this.props.activePlayer.name+"'s turn to choose an action.";

      if (this.props.activePlayer.name == this.props.userName){
        //TURN STANDARD ACTIONS------------------------------------------------
        if(this.props.turn.currentEvent.type === "choosePlayerAction"){
          actionText = "Choose your action."

          if (this.props.activePlayer.location != 6){
            displayMoveForward = true;
          }
          if (this.props.activePlayer.location != 0){
            displayMoveBackward = true;
          }
          //CHECKS:------------------------------------------------------------
        } else if (this.props.turn.currentEvent.type === "check"){
          actionText = "Roll a "+this.props.activePlayer[this.props.turn.currentEvent.checkStat]+
                  " or lower to pass the "+ this.props.turn.currentEvent.checkStat+ " check."
          displayRollCheck = true;
        } 
      }
    }
    else if (this.props.gameState === gameStates.animationsPlayingOut){
      actionText = "Resolving: "+this.props.turn.currentEvent.type;
      if (this.props.turn.currentEvent.type === "display"){
          actionText = "You rolled a "+ this.props.turn.currentEvent.value
        }

    }


    return (
      <div className="layoutDIV" id='ActionAREA'>
        <h2 style={{display:"block"}}>{actionText}</h2>
        <ActionButton text="Start Game" display={displayStart} userName={this.props.userName}/>
        <ActionButton text="Move Forward" display={displayMoveForward} userName={this.props.userName}/>
        <ActionButton text="Move Backward" display={displayMoveBackward} userName={this.props.userName}/>
        <ActionButton text="Roll Check" display={displayRollCheck} userName={this.props.userName}/>

      </div>
    )
  }
});

module.exports = ActionAREA;



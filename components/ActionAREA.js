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
    var self = this
    
    var actionButtons = [];
    var actionText = ""


  	if (this.props.gameState === gameStates.gatherPlayers){
      actionButtons = ["Start Game"]
      actionText = "Waiting for all players to join..."
    }
    else if (this.props.gameState === gameStates.chooseActionCard){
      console.log("chooseActionCard")
      if (this.props.activePlayer.name == this.props.userName){
        actionText = "Choose which card to play."
      }else{
        actionText = "It is "+this.props.activePlayer.name+"'s turn to choose an action.";
      }

    }

    else if (this.props.gameState === gameStates.waitingForPlayerInput){
      
      actionText = "It is "+this.props.activePlayer.name+"'s turn to choose an action.";

      if (this.props.activePlayer.name == this.props.userName){
        //TURN STANDARD ACTIONS------------------------------------------------
        if(this.props.turn.currentEvent.type === "choosePlayerAction"){
          actionText = "Choose your action."

          actionButtons = this.props.turn.currentEvent.actionList
          //CHECKS:------------------------------------------------------------
        } else if (this.props.turn.currentEvent.type === "check"){
          actionText = "Roll a "+this.props.activePlayer[this.props.turn.currentEvent.checkStat]+
                  " or lower to pass the "+ this.props.turn.currentEvent.checkStat+ " check."
          actionButtons = this.props.turn.currentEvent.actionList
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
        {actionButtons.map(function(text){
          return <ActionButton text={text} key={text} userName={self.props.userName}/> })
        }

      </div>
    )
  }
});

module.exports = ActionAREA;



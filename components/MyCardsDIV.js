var React = require('react');
var ActionCard = require('./ActionCard.js')
var gameStates = require('../game_modules/gameStates.js');

// props are:
//   players: {playerName: Player}
//   userName: ""
//   activePlayer: Player
//   gameState: int(enum)


var MyCardsDIV = React.createClass({
  render: function () {
  	if (this.props.userName){
	  	var userPlayer = this.props.players[this.props.userName]
		  	

	  	if (this.props.gameState != gameStates.gatherPlayers){
		    return (
		      <div  className="layoutDIV" id='MyCardsDIV'>
		        {userPlayer.hand.map(function(card){
		        	return(
							<ActionCard card={card} key={card.name}/>
		        		)
		        	})  	
		       	}
		      </div>
		    )
  		}
  		
  	} 

  	return ( <div  className="layoutDIV" id='MyCardsDIV'> </div>) 
  }

  
});

module.exports = MyCardsDIV;



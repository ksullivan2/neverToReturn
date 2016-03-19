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
		  	

	  	if (this.props.gameState != gameStates.gatherPlayers){

		  	var userHand = this.props.players[this.props.userName].hand;


		  	var cardsInHand = [];
		    
		    for (var i = 0; i < userHand.length; i++){
		      cardsInHand.push({card: userHand[i], key:(this.props.userName+"card"+i), offset:(i*10)})
		    }
		    console.log(userHand)
		    
		    if (cardsInHand.length > 0){
			    return (
			      <div  className="layoutDIV" id='MyCardsDIV'>
			        {cardsInHand.map(function(eachCard){
			        	return(
								<ActionCard card={eachCard.card} key={eachCard.key} offset={eachCard.offset}/>
			        		)
			        	})  	
			       	}
			      </div>
			    )
		    	
		    }
  		}
  		
  	} 

  	return ( <div  className="layoutDIV" id='MyCardsDIV'> </div>) 
  }

  
});

module.exports = MyCardsDIV;



var React = require('react');
var ActionCard = require('./ActionCard.js')
var gameStates = require('../game_modules/gameStates.js');

// props are:
//   players: {playerName: Player}
//   userName: ""
//   activePlayer: Player
//   gameState: int(enum)


var MyCardsDIV = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState){
  	if (!this.props.userName && nextProps.userName){
  		return true
  	}

  	if (nextProps.players[nextProps.userName] && this.props.players[this.props.userName]){
	  	//if a card is added or removed
	  	if (this.props.players[this.props.userName].hand.length != nextProps.players[nextProps.userName].hand.length){
	  		return true;
	  	}

	  	//if any card has changed
	  	for (var i = 0; i < nextProps.players[nextProps.userName].hand.length; i++) {
	  		if (nextProps.players[nextProps.userName].hand[i].name != this.props.players[this.props.userName].hand[i].name){
	  			return true;
	  		}
	  	}
  	}
  	return false;
  },

  render: function () {
  	if (this.props.userName){
		  	

	  	if (this.props.gameState != gameStates.gatherPlayers){

		  	var userHand = this.props.players[this.props.userName].hand;


		  	var cardsInHand = [];
		    
		    for (var i = 0; i < userHand.length; i++){
		      cardsInHand.push({card: userHand[i], key:(this.props.userName+"card"+i), offset:(i*10)})
		    }	    
		    
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

  	return ( <div  className="layoutDIV" id='MyCardsDIV'>There are no cards in your hand. </div>) 
  }

  
});

module.exports = MyCardsDIV;



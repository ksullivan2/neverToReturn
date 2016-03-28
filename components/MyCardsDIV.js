var React = require('react');
var ActionCard = require('./ActionCard.js')
var gameStates = require('../game_modules/gameStates.js');

// props are:
//   players: {playerName: Player}
//   userName: ""
//   activePlayer: Player
//   gameState: int(enum)


var MyCardsDIV = React.createClass({
  getInitialState: function(){
    return(
      {canvas_x: 0,
      canvas_y: 0,
      canvas_height: 0,
      canvas_width: 0,
  	  activeCard: ""}
    )
  },

  componentDidMount: function(){
    this.calculateCanvas();
    window.addEventListener("resize", this.calculateCanvas);
  },

  calculateCanvas: function(){
    var neckLocation = document.getElementById("MyCardsDIV").getBoundingClientRect();

    this.setState({
      canvas_x: neckLocation.left,
      canvas_y: neckLocation.top,
      canvas_height: neckLocation.bottom - neckLocation.top,
      canvas_width: neckLocation.right - neckLocation.left
    })
  },

  handleMouseOver: function(cardName){
  
  	this.setState({
  		activeCard: cardName
  	})
  },

  calculateCardOffset: function(activeCard){
  	var userHand = this.props.players[this.props.userName].hand;

  	var cardsInHand = [];
  
  	
    for (var i = 0; i < userHand.length; i++){
    	if (i === 0){
    		var offset = 0;
    	} else {
    		var offset = cardsInHand[i-1].offset + 5
    	}
    		
    	
    	if (userHand[i].name === activeCard){
    		offset += 5
    	}

      cardsInHand.push({card: userHand[i], key:(this.props.userName+"card"+i), offset:offset})
    }
    return cardsInHand
  },

  render: function () {
  	var self = this;

  	if (this.props.userName){
		  	
	  	if (this.props.gameState != gameStates.gatherPlayers){

		  	var cardsInHand = this.calculateCardOffset(self.state.activeCard)	    
		    
		    if (cardsInHand.length > 0){
			    return (
			      <div  className="layoutDIV" id='MyCardsDIV'>
			        {cardsInHand.map(function(eachCard){
			        	return(
								<ActionCard card={eachCard.card} key={eachCard.key} offset={eachCard.offset} handleMouseOver={self.handleMouseOver}/>
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



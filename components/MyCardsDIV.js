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
  	var center = Math.floor(userHand.length/2)
  	var activeIndex = null;

  	for (var i = 0; i < userHand.length; i++) {
  		if (userHand[i].name === activeCard){
  			activeIndex = i;
  			break;
  		}
  	}
  
  	var leftSeparation = 5
  	var cardRotation = 10

    for (var i = 0; i < userHand.length; i++){
    	var offset = {left: 0, rotation: 0, X: 0}
    	
    	if (i === center){
    		offset.left = 30;
    		offset.rotation = 0;
    	} else {
    		offset.left = ((i - center) * leftSeparation ) + 30
    		offset.rotation = ((i - center) * cardRotation )
    	}
    	
    	if (i > activeIndex){
    		offset.rotation += cardRotation
    	}

    	if (i < center){
    		offset.X = 100
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
								<ActionCard card={eachCard.card} key={eachCard.key} 
								offset={eachCard.offset} handleMouseOver={self.handleMouseOver}/>
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



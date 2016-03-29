var React = require('react');
var LocationCard = require('./LocationCard');

// props are:
//   location: Location
//   name: ""

var LocationDIV = React.createClass({
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
    var divLocation = document.getElementById("MyCardsDIV").getBoundingClientRect();

    this.setState({
      canvas_x: divLocation.left,
      canvas_y: divLocation.top,
      canvas_height: divLocation.bottom - divLocation.top,
      canvas_width: divLocation.right - divLocation.left
    })
  },

  handleMouseOver: function(cardName){
  
    this.setState({
      activeCard: cardName
    })
  },

  handleMouseOut: function(){
    this.setState({
      activeCard: ""
    })
  },

  calculateCardOffset: function(activeCard){
    var userHand = this.props.players[this.props.userName].hand;

    var cardsInHand = [];
  
    
    for (var i = 0; i < userHand.length; i++){
      if (i === 0){
        var offset = 5;
      } else {
        var offset = cardsInHand[i-1].offset + 5
        if (cardsInHand[i-1].card.name === activeCard){
          offset += 30
        }
      }
      
      cardsInHand.push({card: userHand[i], key:(this.props.userName+"card"+i), offset:offset})
    }
    return cardsInHand
  },


  render: function () {
    var self = this;

    var cardsInLocation = [];
    for (var i = 0; i < this.props.location.cards.length; i++){
      cardsInLocation.push({card: this.props.location.cards[i], key:(this.props.name+"card"+i)})
    }

    return (
      <div className="locationDIV">
        {cardsInLocation.map(function(eachCard){
          return(
            <LocationCard card={eachCard.card} key={eachCard.key} offset={eachCard.offset} handleMouseOver={self.handleMouseOver}/>
          )
        })
        }
      </div>
    )
  }
});

module.exports = LocationDIV;



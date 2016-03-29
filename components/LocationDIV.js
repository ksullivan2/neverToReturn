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
    console.log("handleMouseOut")
    this.setState({
      activeCard: ""
    })
  },

  calculateCardOffset: function(activeCard){
    var cardsInLocation = [];

    for (var i = 0; i < this.props.location.cards.length; i++){
      var offset = {bottom: 0, zIndex: 50}
      if (i != 0){
        
        offset.bottom = cardsInLocation[i-1].offset.bottom + 5
        offset.zIndex = cardsInLocation[i-1].offset.zIndex -1
        
        if (cardsInLocation[i-1].card.name === activeCard){
          offset.bottom += 30
        }
      }


      cardsInLocation.push({card: this.props.location.cards[i], key:(this.props.name+"card"+i), offset: offset})
    }
    return cardsInLocation
  },


  render: function () {
    var self = this;

    var cardsInLocation = this.calculateCardOffset(this.state.activeCard)
    

    return (
      <div className="locationDIV" onMouseOut={self.handleMouseOut}>
        {cardsInLocation.map(function(eachCard){
          return(
            <LocationCard card={eachCard.card} key={eachCard.key} offset={eachCard.offset} 
            handleMouseOver={self.handleMouseOver}/>
          )
        })
        }
      </div>
    )
  }
});

module.exports = LocationDIV;



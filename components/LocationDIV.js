var React = require('react');
var LocationCard = require('./LocationCard');

// props are:
//   location: Location
//   name: ""

var LocationDIV = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState){
    //only update if: number of cards changes, or one of the cards changes

    if (this.props.location.cards.length != nextProps.location.cards.length){
      return true;
    }

    for (var i = 0; i < nextProps.location.cards.length; i++) {
      if (this.props.location.cards[i].name != nextProps.location.cards[i].name){
        return true;
      }
    }

    return false;
  },


  render: function () {
    var cardsInLocation = [];
    for (var i = 0; i < this.props.location.cards.length; i++){
      cardsInLocation.push({card: this.props.location.cards[i], key:(this.props.name+"card"+i)})
    }

    return (
      <div className="locationDIV">
        {cardsInLocation.map(function(eachCard){
          return(
            <LocationCard card={eachCard.card} key={eachCard.key} />
          )
        })
        }
      </div>
    )
  }
});

module.exports = LocationDIV;



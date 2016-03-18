var React = require('react');
var LocationCard = require('./LocationCard');



var LocationDIV = React.createClass({
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



var React = require('react');

// props are:
//   card: ActionCard
//	offset: int (index in player's hand)


var ActionCard = React.createClass({
  render: function () {
    return (
      <div  className="actionCard" style={{left: this.props.offset+"%"}}>
        <img src={this.props.card.imgSRC} className="cardImage"/>
      </div>
    )
  }
});

module.exports = ActionCard;



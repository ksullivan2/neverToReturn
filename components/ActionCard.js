var React = require('react');

// props are:
//   players: {playerName: Player}
//   userName: ""
//   activePlayer: Player


var ActionCard = React.createClass({
  render: function () {
    return (
      <div  className="actionCard">
        <img src={this.props.card.imgSRC} className="cardImage"/>
      </div>
    )
  }
});

module.exports = ActionCard;



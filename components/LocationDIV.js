var React = require('react');


var LocationDIV = React.createClass({
  render: function () {
    return (
      <div className="cardDIV">
        {this.props.name}
        <img src={this.props.card.imgSRC} className="card"/>
      </div>
    )
  }
});

module.exports = LocationDIV;



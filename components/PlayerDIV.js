var React = require('react');



var PlayerDIV = React.createClass({
  render: function () {
    var divStyle = {
      color: this.props.player.color
    }

    return (
      <div  className="PlayerDIV" style={divStyle}>
        <h2>{this.props.player.name}</h2>
        
      </div>
    )
  }
});

module.exports = PlayerDIV;



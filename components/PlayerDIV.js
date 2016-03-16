var React = require('react');



var PlayerDIV = React.createClass({
  render: function () {
    var border = ""
    if (this.props.active){
      border = "2px solid black"
    }

    var divStyle = {
      color: this.props.player.color,
      border: border
    }

    return (
      <div  className="PlayerDIV" style={divStyle}>
        <h2>{this.props.player.name}</h2>
        
      </div>
    )
  }
});

module.exports = PlayerDIV;



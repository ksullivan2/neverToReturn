var React = require('react');

//props are:
// player: Player
// active: bool

var PlayerDIV = React.createClass({
  render: function () {
    var border = '';
    if (this.props.active){border = "2px solid black"}

    var divStyle = {
      color: this.props.player.color,
      border: border
    }

    if (!this.props.player.card){
      return (
        <div  className="PlayerDIV" style={divStyle}>
          <h2>{this.props.player.name}</h2>   
        </div>
      )
    } else {
      return(
        <div  className="PlayerDIV" style={divStyle}>
          <h2>{this.props.player.name}</h2>
          <h4>{this.props.player.card.name}</h4>
          <p>Pain: {this.props.player.pain}/{this.props.player.card.pain}</p>
          <p>Madness: {this.props.player.madness}/{this.props.player.card.madness}</p>
          
        </div>
        )
    }


  }
});

module.exports = PlayerDIV;



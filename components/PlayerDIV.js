var React = require('react');

//props are:
// player: Player
// active: bool

var PlayerDIV = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState){
    //if stats changed
    if (nextProps.player.pain != this.props.player.pain 
        || nextProps.player.madness != this.props.player.madness
        || nextProps.player.progress != this.props.player.progress)
      {
        return true;
      }

    //if we're swapping the active player to/from this player
    if (this.props.active != nextProps.active){
      return true;
    }

    return false;

  },


  render: function () {
    var border = '';
    if (this.props.active){border = "2px solid black"}

    var divStyle = {
      backgroundColor: this.props.player.color,
      border: border
    }

    var playerNameForDisplay = this.props.player.name;
    if (!this.props.player.name){
      playerNameForDisplay = "disconnected"
    }

    

    if (!this.props.player.card){
      return (
        <div  className="PlayerDIV" style={divStyle}>
          <h2>{playerNameForDisplay}</h2>   
        </div>
      )
    } else {
      var imgSRC = "/assets/playerThumbnails/"+this.props.player.card.name+".jpg"
      
      return(
        <div  className="PlayerDIV" style={divStyle}>
          <h2>{this.props.player.name}</h2>
          <h4>{this.props.player.card.name}</h4>
          <div className="PlayerDIVThumbnail">
            <img src={imgSRC} className="playerThumbnail" />
          </div>
          <p>Pain: {this.props.player.pain}/{this.props.player.card.pain}</p>
          <p>Madness: {this.props.player.madness}/{this.props.player.card.madness}</p>
          <p>Progress: {this.props.player.progress}</p>
          
        </div>
        )
    }


  }
});

module.exports = PlayerDIV;



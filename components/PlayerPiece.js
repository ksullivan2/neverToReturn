var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;

//props are:
    // player: Player
    // active: bool
    // coords: {top,bottom,left,right}
    // diameter: float


var PlayerPiece = React.createClass({

  render: function () {
    var self = this;

  	var border = '';
    var zIndex = "99";

    if (this.props.active){
    	border = "2px solid black";
      zIndex = "100";
    }

    return (
      <Motion defaultStyle={{left: 0, bottom: 0}} 
              style={{left: spring(this.props.coords.left), bottom: spring(this.props.coords.bottom)}}>
        {function(interpolatingStyle){
          return(
            <div className="playerPiece" 
                  style={{border: border,
                        left: interpolatingStyle.left,
                        bottom: interpolatingStyle.bottom,
                        width: self.props.diameter,
                        height: self.props.diameter,
                        zIndex: zIndex}}>
              <div className="playerThumbnail" style={{background: "url('/assets/playerThumbnails/homelyVillager.jpg')",
                                                      backgroundSize: "contain"}} >
                <div className="playerPieceColor" 

                    style= {{background: self.props.player.color,
                            opacity: ".35"}} >
                </div>
              </div>
            </div>
          )
        }} 
      </Motion>
    )
  }
});

module.exports = PlayerPiece;



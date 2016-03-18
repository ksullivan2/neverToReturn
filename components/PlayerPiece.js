var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;


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
              <div className="playerThumbnail" style={{backgroundImage: "url('/assets/playerThumbnails/homelyVillager.jpg')"}} >
                <div className="playerPieceColor" 
                    /* style={{background: "radial-gradient("+self.props.player.color+" 0%, hsla(0, 100%, 20%, 0) 100%) 0 0"}}*/
                    style= {{background: "rgba(10,100,20,.7)"}} >
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



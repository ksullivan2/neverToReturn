var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;

// props are:
// 	card: TerrainCard/MonsterCard
//	offset: {bottom: int, zIndex: int}
// handleMouseOver: function

var LocationCard = React.createClass({
	handleMouseOver: function(){
		this.props.handleMouseOver(this.props.card.name)
	},


  render: function () {
  	var self = this;

    return (
    	<Motion defaultStyle={{bottom: 0}} 
              style={{bottom: spring(self.props.offset.bottom)}}>
            {function(interpolatingStyle){
            	return(
			      <div  className="terrainCard" style={{bottom: interpolatingStyle.bottom+"%", zIndex: self.props.offset.zIndex}} 
			      		onMouseOver={self.handleMouseOver}>
			        <img src={self.props.card.imgSRC} className="terrainCardImage"/>
			      </div>
            		)
            }}

		</Motion>
    )
  }
});

module.exports = LocationCard;



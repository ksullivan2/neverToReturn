var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;

// props are:
// 	card: TerrainCard/MonsterCard
//	offset: int 
// handleMouseOver: function

var LocationCard = React.createClass({
	handleMouseOver: function(){
		console.log(this.props.card.name)
		this.props.handleMouseOver(this.props.card.name)
	},


  render: function () {
  	var self = this;

    return (
    	<Motion defaultStyle={{bottom: 0}} 
              style={{bottom: spring(self.props.offset)}}>
            {function(interpolatingStyle){
            	return(
			      <div  className="terrainCard" style={{bottom: interpolatingStyle.bottom+"%"}} onMouseOver={self.handleMouseOver}>
			        <img src={self.props.card.imgSRC} className="terrainCardImage"/>
			      </div>
            		)
            }}

		</Motion>
    )
  }
});

module.exports = LocationCard;



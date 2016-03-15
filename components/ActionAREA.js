var React = require('react');
var $ = require('jQuery');
var socket = io();

//bind buttons----------------------------------------------------------------------------------------------------------


//REACT CLASS

var ActionAREA = React.createClass({
	componentDidMount: function(){
		$("#endTurnButton").click(function(){
			console.log("end turn click");
	    	socket.emit("end turn");
	  	});

	  	$("#startGameButton").click(function(){
	    	console.log("start game click");
	    	socket.emit("start game button");
	  	});
	},


  render: function () {
  	var buttonStyle = {margin: 'auto', width: '100px', height: '50px'};
    return (
      <div className="layoutDIV" id='ActionAREA'>
        ActionAREA
        <button id="startGameButton" style={buttonStyle} >Start Game</button>
		<button id="endTurnButton" style={buttonStyle} >END TURN</button>
      </div>
    )
  }
});

module.exports = ActionAREA;



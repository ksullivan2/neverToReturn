var React = require('react');

//bind buttons----------------------------------------------------------------------------------------------------------
/*$(document).ready(function(){
  $("#endTurnButton").click(function(){
    socket.emit("end turn");
  });

  $("#startGameButton").click(function(){
    socket.emit("start game button");
  });
};
*/

//REACT CLASS

var ActionAREA = React.createClass({
	

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



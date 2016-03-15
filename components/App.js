var React = require('react');
var ReactDOM = require('react-dom');
var PlayerDIV = require('./PlayerDIV');
var ActionAREA = require('./ActionAREA');
var PlayerCardsDIV = require('./PlayerCardsDIV');
var NeckDIV = require('./NeckDIV');

//EVENTS--------------------------------------------------------------------------------------------------------------
var socket = io();

socket.on("new player", function(data){
  getName(data);
});

socket.on("name taken", function(data){
  getName(data);
});

socket.on('new player added', function(data){
  console.log("new player added")
})



//INTERACT WITH HUMAN--------------------------------------------------------------------------------------------------------
function getName(data){
  var name = null;
  do {
    name = prompt("What is your name?","Player "+data.playerIndex);
  }while (!name);
  
  socket.emit("create player",{name: name});
}





//REACT RENDER APP---------------------------------------------------------------------------------------------------------
var App = React.createClass({
  render: function () {
    return (
      <div id='App'>
        <PlayerDIV />
        <ActionAREA />
        <PlayerCardsDIV />
        <NeckDIV />
      </div>
    )
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));



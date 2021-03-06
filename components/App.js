var React = require('react');
var ReactDOM = require('react-dom');
var OpponentsDIV = require('./OpponentsDIV');
var ActionAREA = require('./ActionAREA');
var MyCardsDIV = require('./MyCardsDIV');
var NeckDIV = require('./NeckDIV');
var $ = require('jquery');

var socket = io();


//INTERACT WITH HUMAN----------------------------------------------------------------------------------------------

socket.on("new player", function(data){
  getName(data);
});

socket.on("name taken", function(data){
  getName(data);
});


function getName(data){
  var name = null;
  do {
    name = prompt("What is your name?","Player "+ data.playerIndex);
  }while (!name);
  
  socket.emit("create player",{name: name, socketID:socket.id});
}


//DEBUG FUNCTIONS------------------------------------------------------------------------------------------------------
function restartGame(){
  if (confirm("Do you REALLY want to re-start the whole game and scrap everything to this point?")){
    socket.emit("restart game")
  }
}

function reConnectPlayer(){
  var name = prompt("Input your name EXACTLY as you typed it before")
  socket.emit('reconnect player', {name: name})
}

socket.on("reconnect failed", function(){
  alert("Reconnect failed. Match the name EXACTLY.")
})

//REACT RENDER APP-----------------------------------------------------------------------------------------------

var App = React.createClass({
  getInitialState: function(){
    return{
      players: [],
      neck: [],
      activePlayer: {name: "dummyPlayer"},
      gameState: 0,
      userName: null,
      turn: null
    }
  },

  componentDidMount(){
    var self = this;

//EVENTS--------------------------------------------------------------------------------------------------------------
    socket.on("update gameLogic in view", function(data){
      self.setState({players: data.gameLogic.players, 
                      neck: data.gameLogic.neck,
                      activePlayer: data.gameLogic.activePlayer,
                      gameState: data.gameLogic.gameState,
                      turn: data.gameLogic.turn})
      }) 

    socket.on("update userName", function(data){
      self.setState({userName: data.userName})
    })


  },

  render: function () {
    return (
      <div id='App'>
        <OpponentsDIV players={this.state.players} userName={this.state.userName} activePlayer={this.state.activePlayer} />
        <ActionAREA gameState={this.state.gameState} userName={this.state.userName} activePlayer={this.state.activePlayer} turn={this.state.turn}/>
        <MyCardsDIV gameState={this.state.gameState} players={this.state.players} userName={this.state.userName} activePlayer={this.state.activePlayer}/>
        <NeckDIV players={this.state.players} neck={this.state.neck} activePlayer={this.state.activePlayer}/>
        <div id="debugDIV">
          <button onClick={restartGame} id="restartGameButton">!!!RESTART GAME!!!</button>
          <button onClick={reConnectPlayer} id="reConnectPlayerButton">HALP I got disconnected</button>
        </div>
      </div>
    )
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));





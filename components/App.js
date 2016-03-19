var React = require('react');
var ReactDOM = require('react-dom');
var OpponentsDIV = require('./OpponentsDIV');
var ActionAREA = require('./ActionAREA');
var MyCardsDIV = require('./MyCardsDIV');
var NeckDIV = require('./NeckDIV');
var $ = require('jquery');

//EVENTS--------------------------------------------------------------------------------------------------------------
var socket = io();



socket.on("new player", function(data){
  getName(data);
});

socket.on("name taken", function(data){
  getName(data);
});






//INTERACT WITH HUMAN--------------------------------------------------------------------------------------------------------

function getName(data){
  var name = null;
  do {
    name = prompt("What is your name?","Player "+ data.playerIndex);
  }while (!name);
  
  socket.emit("create player",{name: name, socketID:socket.id});
}




//REACT RENDER APP---------------------------------------------------------------------------------------------------------


var App = React.createClass({
  getInitialState: function(){
    return{
      players: [],
      neck: [],
      activePlayer: null,
      gameState: 0,
      userName: null
    }
  },


  componentDidMount(){
    var self = this;

    socket.on("pass initial state", function(data){
      self.setState({players: data.players, 
                      neck: data.neck,
                      activePlayer: data.activePlayer,
                      gameState: data.gameState})
      }) 

    socket.on("update userName", function(data){
      self.setState({userName: data.userName})
    })

    socket.on('update players', function(data){
      self.setState({players: data.players, activePlayer: data.activePlayer});
      })

    socket.on('update neck', function(data){
      self.setState({neck: data.neck})
    })

    socket.on('game started', function(data){
      self.setState({neck: data.neck, 
                      activePlayer: data.activePlayer,
                      gameState: data.gameState})
    })

    socket.on('next turn', function(data){
      self.setState({activePlayer: data.activePlayer})
    })
  },

  render: function () {
    return (
      <div id='App'>
        <OpponentsDIV players={this.state.players} userName={this.state.userName} activePlayer={this.state.activePlayer} />
        <ActionAREA gameState={this.state.gameState} userName={this.state.userName} activePlayer={this.state.activePlayer}/>
        <MyCardsDIV gameState={this.state.gameState} players={this.state.players} userName={this.state.userName} activePlayer={this.state.activePlayer}/>
        <NeckDIV players={this.state.players} neck={this.state.neck} activePlayer={this.state.activePlayer}/>
      </div>
    )
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));





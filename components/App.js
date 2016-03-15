var React = require('react');
var ReactDOM = require('react-dom');
var OpponentsDIV = require('./OpponentsDIV');
var ActionAREA = require('./ActionAREA');
var MyCardsDIV = require('./MyCardsDIV');
var NeckDIV = require('./NeckDIV');

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
    name = prompt("What is your name?","Player "+data.playerIndex);
  }while (!name);
  
  socket.emit("create player",{name: name});
}






//REACT RENDER APP---------------------------------------------------------------------------------------------------------
var App = React.createClass({
  getInitialState: function(){
    return{
      players: []
    }
  },

  componentDidMount(){
    self = this;
    socket.on('new player added', function(data){
      console.log (data.players)
      self.setState({players: data.players});
      })
  },

  render: function () {
    return (
      <div id='App'>
        <OpponentsDIV players={this.state.players}/>
        <ActionAREA />
        <MyCardsDIV />
        <NeckDIV/>
      </div>
    )
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));



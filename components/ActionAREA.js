var React = require('react');
var $ = require('jquery');
var socket = io();
var gameStates = require('../game_modules/gameStates.js');
var ActionButton = require('./ActionButton.js')


//REACT CLASS



var ActionAREA = React.createClass({
	
  render: function () {
  	


    return (
      <div className="layoutDIV" id='ActionAREA'>
        ActionAREA
        <ActionButton text="Start Game" display="true"/>
		<ActionButton text="End Turn" display="true"/>
      </div>
    )
  }
});

module.exports = ActionAREA;



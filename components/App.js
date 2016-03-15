var React = require('react');
var ReactDOM = require('react-dom');
var PlayerDIV = require('./PlayerDIV');
var ActionAREA = require('./ActionAREA');
var PlayerCardsDIV = require('./PlayerCardsDIV');
var NeckDIV = require('./NeckDIV');

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

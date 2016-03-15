var React = require('react');
var CardDIV = require('./CardDIV');

var neck =[0,1,2,3,4,5,6]

var NeckDIV = React.createClass({
  render: function () {

    var cardsInNeck = neck.map(function(card){
      var key = "cardDIV" + card
      return <CardDIV className="cardDIV" key={key} />
    })

    return (
      <div  className="layoutDIV" id='NeckDIV'>
        
        <div id="allCardsDIV" className="layoutDIV">
        	{cardsInNeck}
        </div>
      </div>
    )
  }
});

module.exports = NeckDIV;



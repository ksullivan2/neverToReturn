var React = require('react');
var LocationDIV = require('./LocationDIV');
var PlayerPiece = require('./PlayerPiece');
var NeckCanvas = require('./NeckCanvas')
var socket = io();



var NeckDIV = React.createClass({
  

  render: function () {
    

    var self = this;

    //creating an array to be rendered below
    var locationsInNeck = [];
    for (var i = 0; i < this.props.neck.length; i++){
      locationsInNeck.push({location: this.props.neck[i], key:("location"+i)})
    }


    return (
      <div  className="layoutDIV" id='NeckDIV'>
        <NeckCanvas players={this.props.players} activePlayer={this.props.activePlayer} neck={this.props.neck}/>
        

        <div id="allCardsDIV" className="layoutDIV">
          {locationsInNeck.map(function(eachLocation){
            return <LocationDIV location={eachLocation.location} 
                                key={eachLocation.key} 
                                name={eachLocation.key} />
          })}
          
        </div>
      </div>
    )
  }
});

module.exports = NeckDIV;



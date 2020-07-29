import React from 'react';
import './Track.css';

class Track extends React.Component{
  constructor(props){
    super(props);

    //bind methods to class
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  
  //method sends current selected track to addTrack method in App.js
  addTrack(){
    this.props.onAdd(this.props.track);
  }

  //method sends current selected track to removeTrack method in App.js
  removeTrack(){
    this.props.onRemove(this.props.track);
  }
  
  //method returns an action (add/remove track) depending on which button is pressed
  renderAction(){
    if (this.props.isRemoval){
      return <button className="Track-action"
                      onClick={this.removeTrack}>-</button>;
    } else {
      return <button className="Track-action"
                      onClick={this.addTrack}>+</button>;
    }
  }
  
  render(){
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderAction()} {/*diplsays either a plus or minus depending on which list the track is in (results or playlist) */}
      </div>
    );
  }
}

export default Track;
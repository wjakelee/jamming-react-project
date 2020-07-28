import React from 'react';
import './TrackList.css';

class TrackList extends React.Component(){
  render(){
    return (
      <div class="Track">
        <div class="Track-information">
          <h3>{/*track name will go here */}</h3>
          <p>{/*track artist will go here*/} | {/* track album will go here */}</p>
        </div>
        <button class="Track-action">{/* + or - will go here */}</button>
      </div>
    );
  }
}
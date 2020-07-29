import React from 'react';
import './TrackList.css';

import Track from '../Track/Track';


class TrackList extends React.Component{
  render(){
    return (
      <div className="TrackList">
         {
           /* interates across the passed prop 'tracks' to create an
           instance of each individual track within 'tracks'*/
          this.props.tracks.map(track => {
            return <Track track={track}
                          key={track.id}
                          onAdd={this.props.onAdd}
                          onRemove={this.props.onRemove}
                          isRemoval={this.props.isRemoval}/>;
          })
         }
      </div>
    );
  }
}

export default TrackList;
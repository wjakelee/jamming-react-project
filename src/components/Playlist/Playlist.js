import React from 'react';
import './Playlist.css';

import TrackList from '../TrackList/TrackList'  //tracklsit component

class Playlist extends React.Component{
  constructor(props){
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);   //bind method to class
  }
  
  //method sends requested playlist name change to the updatePlaylistName method in App.js
  handleNameChange(e){
    this.props.onNameChange(e.target.value);
  }
  
  render(){
    return (
      <div className="Playlist">
        <input defaultValue={this.props.playlistName} onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks}
                    onRemove={this.props.onRemove}
                    isRemoval={true}/>                                        {/*instance of tracklist component*/}
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
      </div>
    );
  }
}

export default Playlist;
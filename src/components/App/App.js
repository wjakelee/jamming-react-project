import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';               //searchbar component
import SearchResults from '../SearchResults/SearchResults';   //search results component
import Playlist from '../Playlist/Playlist';                  //playlist component

import Spotify from '../../util/Spotify';               //Spotify API component

class App extends React.Component{
  constructor(props){
    super(props);
    
    this.state = {                      //initial state values
      searchResults: [],

      playlistName: 'New Playlist',

      playlistTracks: []
    };

    //binding all methods to this class
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName= this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  
  /*method checks to see if the selected track is already within the users playlsit, 
  if not the method adds the track to the playlist*/
  addTrack(track){
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }

    tracks.push(track);
    this.setState(
      { playlistTracks: tracks }
    )
    
    //removes added track from search results list
    let results = this.state.searchResults;
    results = results.filter(currentTrack => currentTrack.id !== track.id);
    this.setState(
      { searchResults: results }
    )



  }

  /*method removes a track from the users playlist by using the 
  filter method to compare track ids, every track id that is not
  the same as the requested removed track will return in an array*/
  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState(
      { playlistTracks: tracks }
    )

    //adds track that is removed from playlist back to the search results
    let results = this.state.searchResults;
    if (results.find(unsavedTrack => unsavedTrack.id === track.id)){
      return;
    }

    results.unshift(track);
    this.setState(
      { SearchResults: results }
    )

  }

  /*method updates the name of the playlist before submitting to Spotify */
  updatePlaylistName(name){
    this.setState( { playlistName: name } )
  }

  /*method calls the Spotify API to save the created playlist to the users Spotify account */
  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    this.setState(
      {
        playlistName: 'New Playlist',         //After saving, the state values are reset to initial values
        playlistTracks: []
      }
    );
  }

  /*method calls the spotify API with a search term to return
  search results in relation to that term */
  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>                         {/*instance of searchbar component*/}
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}   
                            onAdd={this.addTrack}/>                   {/*instance of search results component*/}
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>                    {/*instance of playlist component*/}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
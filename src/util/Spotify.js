let accessToken;
const clientID = '32c5c39ece784466b2425f10bac1469a';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  //method retrieves access token and expire time from Spotify API
  getAccessToken(){
    if (accessToken){
      return accessToken;
    }
    
    // check for access token and expire time match (returned in the URL from Spotify)
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    // if both the access token and expiration time were retrieved form the URL
    if (accessTokenMatch && expiresInMatch){
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
     
      // this clears the parameters, allowing us to grab a new access token when it expires
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    
    //if one or either the access token and expire time arent retreived, user is redirected
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      window.location = accessURL;
    }
  },

  //method searhes Spotify API with term supplied by user
  search(term){
    const accessToken = this.getAccessToken();      //retrieve access token
    
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {  //get request to Sportify API for requested search results(tracks)
      headers: {
        Authorization: `Bearer ${accessToken}`    //authorization with access token
      }
    }).then(response => {
      return response.json();     // turn api response to json
    }).then(jsonResponse => {
      if (!jsonResponse.tracks){    //if no response, return no tracks
        return [];
      }
      return jsonResponse.tracks.items.map(track => {
        /*maps across json repsonse of tracks and returns an
         array of objects, each object conisting of track information*/
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview: track.preview_url
        };
      });
    });
  },

  //method saves playlist to users spotify account using spotify API
  savePlaylist(name, trackURIs){
    if (!name && !trackURIs){     //makes sure the playlist name and track uris are passed as arguments in App.js
      return;
    }

    const accessToken = this.getAccessToken();                    //retrieve accessToken
    const headers = { Authorization: `Bearer ${accessToken}` };     //authorization with access token
    let userID;
  
    return fetch('https://api.spotify.com/v1/me', {headers: headers}    //GET request to retrieve users spotify id
    ).then(response => {
      return response.json();                          // turn api response to json
    }).then(jsonResponse => {
      userID = jsonResponse.id;                       // retirve user id
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,    //POST request to add playlsit to users profile using their user id
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: name }),       //post playlist name
        }).then(response => {
          return response.json();                     // turn api response to json
        }).then(jsonResponse => {
          const playlistID = jsonResponse.id;         //retrieve new playlist id
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,   //POST request to add tracks to users playlist using user id and playlist id
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ uris: trackURIs }),      //post tracks to new playlist
            });
          });
          
    });
  
  }

};

export default Spotify;
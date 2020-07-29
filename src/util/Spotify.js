let accessToken;
const clientID = '32c5c39ece784466b2425f10bac1469a';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken(){
    if (accessToken){
      return accessToken;
    }
    
    // check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch){
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // this is going to clear the parameters, allowing us to grab a new access token when it expires.
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      window.location = accessURL;
    }
  },

  search(term){
    const accessToken = this.getAccessToken();
    
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks){
        return [];
      }
      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        };
      });
    });
  },

  savePlaylist(name, trackURIs){
    if (!name && !trackURIs){
      return;
    }

    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userID;
  
    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: name }),
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          const playlistID = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ uris: trackURIs }),
            });
          });
          
    });
  
  }

};

export default Spotify;
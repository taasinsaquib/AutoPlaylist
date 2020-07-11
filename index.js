const express    = require('express');
const SpotifyApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const axios      = require('axios')

require('dotenv').config()

const spotify = new SpotifyApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

const app = express();
app.use(bodyParser.json());

app.get('/login', (req, res) => {
    // to start using the app, navigate here in your browser
    var scopes = 'playlist-modify-public playlist-modify-private user-read-email user-read-private';

    const url = 'https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI);

    console.log("Login url to Spotify: " + url);
    res.redirect(url);
});

app.get('/auth', async function(req, res){
    // redirect uri as entered in spotify app dashboard and in env variables
    // console.log(req.query.code);
    // check req.query.error if there's an error

    // need params for form-urlencoded
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", req.query.code);
    params.append('redirect_uri', process.env.REDIRECT_URI);

    var headers = {
        headers: { 
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) 
        }
    };

    try {
        var token = await axios.post('https://accounts.spotify.com/api/token', params, headers);
    } catch (error) {
        console.log(error)
        res.send("ERROR: " + error)
    }

    // confirm response is good
    // console.log(token.data);

    // const refresh_token = token.data.refresh_token; // save refresh token for later use if needed
    // console.log("Refresh token: " + token.data.refresh_token)
    console.log("Access token: " + token.data.access_token)

    spotify.setAccessToken(token.data.access_token);

    res.send("User authenticated!");
});

app.get('/playlist', async function(req, res){

    // todo - remove later, just for dev purposes
    spotify.setAccessToken(process.env.ACCESS_TOKEN);

    // get current User ID
    try {
        var me = await spotify.getMe();
    } catch (error) {
        console.log(error);
    }
    // console.log(me);

    var userId = me.body.id;

    try {
        var newPlaylist = await spotify.createPlaylist(userId, "My Auto Playlist :o", {public: true});
    } catch (error) {
        console.log(error);
    }
    // console.log(newPlaylist);

    var link = newPlaylist.body.external_urls.spotify;
    console.log("Link: " + link);
    var playlistId = newPlaylist.body.id;

    // todo - function to return array of spotify urls here
    try {
        var addSongs = await spotify.addTracksToPlaylist(playlistId, 
            ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]
        );
    } catch (error) {
        console.log(error)
    }
    // console.log(addSongs);

    res.send("Playlist Created!")
});

app.get('/', (req, res) => {
    res.send("Welcome to the backend");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server up!");
});
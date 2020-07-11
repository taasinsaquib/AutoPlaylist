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
    var scopes = 'playlist-modify-public playlist-modify-private';

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
    console.log(req.query.code);
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
    }

    // confirm response is good
    // console.log(token.data);

    // const refresh_token = token.data.refresh_token; // save refresh token for later use if needed
    spotify.setAccessToken(token.data.access_token);

    res.send("User authenticated!");
});

app.get('/', (req, res) => {
    res.send("Welcome to the backend");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server up!");
});
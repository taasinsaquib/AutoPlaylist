const spotify = require('./spotifyClient');
const axios   = require('axios');

// give url for Reddit post in JSON form, scrape data
async function scrapePost(url){

    var results = [];

    try {
        var thread = await axios(url);
    } catch (error) {
        console.log(error);
    }

    var post = thread.data[0];  // assume the post is always the first element in this array
    post = post.data.children[0].data.selftext;

    post = post.split("\n");
    post = post.filter(function (el) {
        return el != '';
    });

    var startLine = post.indexOf("#Singles") + 1;   // start from line after 
    var endLine = post.indexOf("---")               // singles are always last, so the next section is marked with this

    songs = post.slice(startLine, endLine);

    var regex = /(?<artist>.*)\s-\s(?<song>.*)[^*]$/m;  // ignore lines ending in *, meaning not on spotify

    for (var s of songs){
        let n = s.replace(/&amp;/gm, "&");  // reddit formats & and ' weirdly
        n = n.replace(/\\'/m, "\'");
        
        let match = regex.exec(n);
        if(match != null){
            // console.log(match.groups.artist, ",", match.groups.song);
            results.push({"artist": match.groups.artist, "song": match.groups.song})
        }
        else{
            console.log("ERROR * Couldn't break up this song line * ", s)  // assumes that artist and song are separated by "-"
        }
    }

    // console.dir(results, {'maxArrayLength': null});
    return results;
}

//music = [{"artist: ""Childish Gambino", "song":"3005"}, ...]
async function getSongURIs(songs){
    // todo - just here for dev, remove later
    spotify.setAccessToken(process.env.ACCESS_TOKEN);

    var results = []

    for(const s of songs){
        // console.log(s);
        var searchStr = `track:${s.song} artist:${s.artist}`;

        try {
            var song = await spotify.searchTracks(searchStr, {limit: 1});
            results.push(song.body.tracks.items[0].uri)     // only return 1 result, so hardcode 0 index here
        } catch (error) {
            console.log(`ERR: ${error} - Couldn't find song with artist: ${s.artist}, song: ${s.song}`)
        }
    }

    return results;
}

// similar to above function, but different input and processing
// can't add album URIs directly to playlists, so
// todo - search for all the tracks in an album and add those to the results array (only 100 at a time)

//albums = ["because thE internet", ...]
async function getAlbumURIs(albums){
    // todo - just here for dev, remove later
    spotify.setAccessToken(process.env.ACCESS_TOKEN);

    var results = []

    for(const a of albums){

        console.log(a);
        try {
            var album = await spotify.searchAlbums(a, {limit: 1});
        } catch (error) {
            console.log(error)
        }

        console.log(album.body.albums);
        // only return 1 result, so hardcode 0 index here
        // results.push(album.body.albums)
    }

    console.log(results);
    return results;
}

// given a list of songs, create a playlist, search for the songs, and add the songs to the playlist
// songs: [{"artist: ""Childish Gambino", "song":"3005"}, ...]
// return: link to playlist if successful, "" if error
async function autoPlaylist(songs){

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

    // todo - make this a POST request with song data in body
    try {
        var songURIs = await getSongURIs(songs);
    } catch (error) {
        console.log(error);
    }
    // console.log(songURIs);

    /*
    try {
        var albumURIs = await helpers.getAlbumURIs(["awaken my love", "legends never die"]);
    } catch (error) {
        console.log(error);
    }
    // console.log(albumURIs);
    */

    if(songURIs.length != 0){
        try {
            var addSongs = await spotify.addTracksToPlaylist(playlistId, songURIs);
        } catch (error) {
            console.log(error)
        }
        // console.log(addSongs);
        
        return link;
        // res.redirect(link)
    }

    return "";
}

module.exports = {getSongURIs, getAlbumURIs, scrapePost, autoPlaylist};

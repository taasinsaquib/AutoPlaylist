const spotify    = require('./spotifyClient');

/*
music = [{"artist: ""Childish Gambino", "song":"3005"}, ...]
type  = "songs" or "albums"
*/

async function getSongURIs(songs){
    // todo - just here for dev, remove later
    spotify.setAccessToken(process.env.ACCESS_TOKEN);

    var results = []

    for(const s of songs){
        console.log(s);
        var searchStr = `track:${s.song} artist:${s.artist}`;

        try {
            var song = await spotify.searchTracks(searchStr, {limit: 1});
            results.push(song.body.tracks.items[0].uri)     // only return 1 result, so hardcode 0 index here
        } catch (error) {
            console.log(`ERR: ${error} Couldn't find song with artist: , song: ${s.song}`)
        }
    }

    return results;
}

// similar to above function, but different input and processing
// can't add album URIs directly to playlists, so
// todo - search for all the tracks in an album and add those to the results array (only 100 at a time)
/*
albums = ["because thE internet", ...]
*/
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

module.exports = {getSongURIs, getAlbumURIs};
const spotify    = require('./spotifyClient');

/*
expect this format: 
music = [{"artist: ""Childish Gambino", "art":"3005"}, ...]
type  = "songs" or "albums"
*/

async function getSpotifyURIs(music, type){

    // todo - just here for dev
    spotify.setAccessToken(process.env.ACCESS_TOKEN);

    var result = []

    for(const m of music){
        var searchStr = `track:${m.art} artist:${m.artist}`;
        // console.log(searchStr);

        try {
            var song = await spotify.searchTracks(searchStr, {limit: 1});
        } catch (error) {
            console.log(error)
        }

        // console.log(song.body.tracks.items)
        // only return 1 result, so hardcode 0 index here
        result.push(song.body.tracks.items[0].uri)
    }

    console.log(result);
    return result;
}

module.exports = {getSpotifyURIs};
# AutoPlaylist

* create Spotify playlists from text input
* The ultimate goal is automatically create playlists for new music each Friday, scraping from a Reddit post in r/hiphopheads

## Env
* need CLIENT_ID, CLIENT_SECRET, REDIRECT_URL

## Notes
* Node API Wrapper
    * https://github.com/thelinmichael/spotify-web-api-node
    * https://github.com/thelinmichael/spotify-web-api-node/blob/master/src/spotify-web-api.js
* Docs for authentication
    * https://developer.spotify.com/documentation/general/guides/authorization-guide/
    * https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js
* creating POST request for `application/x-www-form-urlencoded` is different, you can't pass a JSON for the body params
    * https://gist.github.com/akexorcist/ea93ee47d39cf94e77802bc39c46589b
* Playlist Docs
    * https://developer.spotify.com/documentation/web-api/reference/playlists/
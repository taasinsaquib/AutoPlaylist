# AutoPlaylist

* create Spotify playlists from text input
* The ultimate goal is automatically create playlists for new music each Friday, scraping from a Reddit post in r/hiphopheads

## Env
* need CLIENT_ID, CLIENT_SECRET, REDIRECT_URL

## Notes
* creating POST request for `application/x-www-form-urlencoded` is different, you can't pass a JSON for the body params
    * https://gist.github.com/akexorcist/ea93ee47d39cf94e77802bc39c46589b
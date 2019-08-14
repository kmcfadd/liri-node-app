require("dotenv").config();

const axios = require('axios');

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: 'your spotify client id',
    secret: 'your spotify client secret'
});

var keys = require("./keys.js");

var spotify = new spotify(keys.spotify);

var input = process.argv[2]

switch (input) {
    case 'concert-this':
        getConcert();
        break
    case 'spotify-this':
        getSong();
        break
    case 'movie-this':
        getMovie();
        break
    case 'do-what-it-says':
        doThing();
        break
}

// concert-this
axios.get('https://www.omdbapi.com/?t=' + process.argv.slice(3) + '&y=&plot=short&apikey=trilogy').then(function (response) {
    console.log(response.data.Title)
    console.log(response.data.imdbRating)
}).catch(function (err) {
    if (err.response) {
        console.log("------Data-----")
        console.log(err.response.data)
        console.log("-----Status-----")
        console.log(err.response.status)
        console.log("-----Status-----")
        console.log(err.response.headers)

    } else if (err.request) {
        console.log(err.request)
    } else {
        console.log("Error", err.message)
    }
    console.log(err.config);
})

// spotify-this-song

spotify.search({
    type: 'track',
    query: process.argv.slice(3)
}, function (err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }

    console.log(data);
});

// movie-this


// do-what-it-says
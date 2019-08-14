require("dotenv").config();

var fs = require('fs')
const axios = require('axios');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");


var spotify = new Spotify(keys.spotify);

var input = process.argv[2]

var movieTitle;
var songTitle;
var bandTitle;

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

function getConcert() {

    bandTitle = process.argv.slice(3)

    axios.get('https://rest.bandsintown.com/artists/' + bandTitle + '/events?app_id=codingbootcamp').then(function (response) {
        // name of venue
        // venue location
        // date of event formatted with moment as MM/DD/YYYY
    })
}

// spotify-this-song

function getSong() {

    songTitle = process.argv.slice(3)

    spotify.search({
        type: 'track',
        query: songTitle,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data.Title);
    });

}
// movie-this

function getMovie() {

    if (!process.argv[3]) {
        movieTitle = 'Mr. Nobody'
    } else {
        movieTitle = process.argv.slice(3)
    }

    axios.get('https://www.omdbapi.com/?t=' + movieTitle + '&y=&plot=short&apikey=trilogy').then(function (response) {
        console.log(response.data.Title) // title of the movie
        console.log("Released in " + response.data.Year) // year movie came out
        console.log("IMDB Rating " + response.data.Ratings[1].Value) // imdb rating
        console.log("Rotten Tomatoes Rating " + response.data.Ratings[2].Value) // rotten tomatoes rating
        console.log("Produced in " + response.data.Country) // country movie was produced
        console.log("Available in " + response.data.Language) // language of movie
        console.log("Plot: " + response.data.Plot) // plot of movie
        console.log("Actors: " + response.data.Actors) // actors in movie
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

}
// do-what-it-says
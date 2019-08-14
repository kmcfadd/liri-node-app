require("dotenv").config();

var fs = require('fs');
const axios = require('axios');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require('moment');


var spotify = new Spotify(keys.spotify);

var input = process.argv[2]

var movie;
var song;
var artist;

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

    artist = process.argv.slice(3).join("+")

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp').then(function (response) {


            for (var i = 0; i < response.data.length; i++) {

                console.log(response.data[i].venue.name + " " +
                    response.data[i].venue.country + ", " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " +
                    moment(response.data[i].venue.datetime).format("MM/DD/YYYY"))

            }

        })
        .catch(function (err) {
            console.log(err)
        })
}

// spotify-this

function getSong() {

    song = process.argv.slice(3).join("+")

    spotify.search({
            type: 'track',
            query: song,
            limit: 1
        })
        .then(function (data) {

            //console.log(JSON.stringify(data, null, 2));
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name) // artist name
            console.log("Song: " + data.tracks.items[0].name) // song name
            console.log("Album: " + data.tracks.items[0].album.name) // album name
            console.log("Preview: " + data.tracks.items[0].preview_url) // preview url 
        })
        .catch(function (err) {

            console.log(err)
        })

}
// movie-this

function getMovie() {

    if (!process.argv[3]) {
        movie = 'Mr. Nobody'
    } else {
        movie = process.argv.slice(3).join("+")
    }

    axios.get('https://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy')
        .then(function (response) {
            console.log(response.data.Title) // title of the movie
            console.log("Released in " + response.data.Year) // year movie came out
            console.log("IMDB Rating " + response.data.Ratings[i].Value) // imdb rating
            console.log("Rotten Tomatoes Rating " + response.data.Ratings[1].Value) // rotten tomatoes rating
            console.log("Produced in " + response.data.Country) // country movie was produced
            console.log("Available in " + response.data.Language) // language of movie
            console.log("Plot: " + response.data.Plot) // plot of movie
            console.log("Actors: " + response.data.Actors) // actors in movie
        })
        .catch(function (err) {
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
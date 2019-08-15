// all node packages required and linked, including file system to read and write files
require("dotenv").config();

var fs = require('fs');
const axios = require('axios');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require('moment');
// safeguard spotify developer keys
var spotify = new Spotify(keys.spotify);
// take in user input here to be passed into the switch cases
var input = process.argv[2]
// general variable declaration for each case
var movie;
var song;
var artist;
// a switch case to separate each liri mode by user input
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
}

// concert-this
function getConcert() {

    artist = process.argv.slice(3).join("+")

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function (response) {

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

    if (!process.argv[3]) {
        song = 'Ace of Base'
    } else {
        song = process.argv.slice(3).join("+")
    }
    spotify.search({
            type: 'track',
            query: song,
            limit: 1
        })
        .then(function (data) {
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
            console.log(err)
        })
}

// do-what-it-says
function doThing() {

    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err)
        }
        var info = data.split(',')

        var command = info[0]
        var item = info[1]

        switch (command) {
            case 'concert-this':
                axios.get('https://rest.bandsintown.com/artists/' + item + '/events?app_id=codingbootcamp')
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            console.log(response.data[i].venue.name + " " +
                                response.data[i].venue.country + ", " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " +
                                moment(response.data[i].venue.datetime).format("MM/DD/YYYY"))
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                break
            case 'spotify-this':
                spotify.search({
                        type: 'track',
                        query: item,
                        limit: 1
                    })
                    .then(function (data) {
                        console.log("Artist: " + data.tracks.items[0].album.artists[0].name) // artist name
                        console.log("Song: " + data.tracks.items[0].name) // song name
                        console.log("Album: " + data.tracks.items[0].album.name) // album name
                        console.log("Preview: " + data.tracks.items[0].preview_url) // preview url 
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                break
            case 'movie-this':
                axios.get('https://www.omdbapi.com/?t=' + item + '&y=&plot=short&apikey=trilogy')
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
                        console.log(err)
                    })
        }
    })
}
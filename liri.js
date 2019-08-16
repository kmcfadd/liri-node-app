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
// a function to handle all the error catches when returning promises
function errorHandler(err) {
    if (err) {
        console.log(err)
    }
}

// concert-this
function getConcert() {

    artist = process.argv.slice(3).join("+")

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function (response) {

            fs.appendFile('log.txt', 'concert-this ' + process.argv.slice(3).join(' ') + '\n', errorHandler)

            for (var i = 0; i < response.data.length; i++) {

                var concertData = (response.data[i].venue.name + " " +
                    response.data[i].venue.country + ", " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " +
                    moment(response.data[i].datetime).format("MM/DD/YYYY"))

                console.log(concertData)
                fs.appendFile('log.txt', concertData + '\n', errorHandler)
            }
        })
        .catch(errorHandler)
}

// spotify-this
function getSong() {

    if (!process.argv[3]) {
        song = 'Ace of Base'
    } else {
        song = process.argv.slice(3).join("+")
    }

    fs.appendFile('log.txt', 'spotify-this ' + process.argv.slice(3).join(' ') + '\n', errorHandler)

    spotify.search({
            type: 'track',
            query: song,
            limit: 1
        })
        .then(function (data) {

            var artistData = ("Artist: " + data.tracks.items[0].album.artists[0].name + '\n' +
                "Song: " + data.tracks.items[0].name + '\n' +
                "Album: " + data.tracks.items[0].album.name + '\n' +
                "Preview: " + data.tracks.items[0].preview_url + '\n')

            console.log(artistData)
            fs.appendFile('log.txt', "Artist: " + artistData, errorHandler)
        })
        .catch(errorHandler)
}

// movie-this
function getMovie() {

    if (!process.argv[3]) {
        movie = 'Mr. Nobody'
    } else {
        movie = process.argv.slice(3).join("+")
    }

    fs.appendFile('log.txt', 'movie-this ' + process.argv.slice(3).join(' ') + '\n', errorHandler)

    axios.get('https://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy')
        .then(function (response) {

            var movieData = (response.data.Title + '\n' +
                "Released in " + response.data.Year + '\n' +
                "IMDB Rating " + response.data.Ratings[0].Value + '\n' +
                "Rotten Tomatoes Rating " + response.data.Ratings[1].Value + '\n' +
                "Produced in " + response.data.Country + '\n' +
                "Available in " + response.data.Language + '\n' +
                "Plot: " + response.data.Plot + '\n' +
                "Actors: " + response.data.Actors + '\n')

            console.log(movieData)
            fs.appendFile('log.txt', movieData, errorHandler)
        })
        .catch(errorHandler)
}

// do-what-it-says
function doThing() {

    fs.appendFile('log.txt', 'do-what-it-says \n', errorHandler)

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

                            var concertData = (response.data[i].venue.name + " " +
                                response.data[i].venue.country + ", " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " +
                                moment(response.data[i].venue.datetime).format("MM/DD/YYYY"))

                            console.log(concertData)
                            fs.appendFile('log.txt', concertData + '\n', errorHandler)
                        }
                    })
                    .catch(errorHandler)
                break
            case 'spotify-this':
                spotify.search({
                        type: 'track',
                        query: item,
                        limit: 1
                    })
                    .then(function (data) {

                        var artistData = ("Artist: " + data.tracks.items[0].album.artists[0].name + '\n' +
                            "Song: " + data.tracks.items[0].name + '\n' +
                            "Album: " + data.tracks.items[0].album.name + '\n' +
                            "Preview: " + data.tracks.items[0].preview_url + '\n')

                        console.log(artistData)
                        fs.appendFile('log.txt', artistData, errorHandler)
                    })
                    .catch(errorHandler)
                break
            case 'movie-this':
                axios.get('https://www.omdbapi.com/?t=' + item + '&y=&plot=short&apikey=trilogy')
                    .then(function (response) {

                        var movieData = (response.data.Title + '\n' +
                            "Released in " + response.data.Year + '\n' +
                            "IMDB Rating " + response.data.Ratings[0].Value + '\n' +
                            "Rotten Tomatoes Rating " + response.data.Ratings[1].Value + '\n' +
                            "Produced in " + response.data.Country + '\n' +
                            "Available in " + response.data.Language + '\n' +
                            "Plot: " + response.data.Plot + '\n' +
                            "Actors: " + response.data.Actors + '\n')

                        console.log(movieData)
                        fs.appendFile('log.txt', movieData, errorHandler)
                    })
                    .catch(errorHandler)
        }
    })
}
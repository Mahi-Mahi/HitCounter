var http = require('http'); // For serving a basic web page.
var mongoose = require("mongoose"); // The reason for this demo.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/HitCounter';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function(err, res) {
	if (err) {
		console.log('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log('Succeeded connected to: ' + uristring);
	}
});

var itemSchema = new mongoose.Schema({
	uri: String,
	hits: {
		all: {
			type: Number
		},
		last_1_hours: {
			type: Number
		},
		last_7_days: {
			type: Number
		}
	}
});

var Item = mongoose.model('HitCounter', itemSchema);

var express = require("express");
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
	response.send('Hello World!');
});

app.post('/hit/:uri', function(request, response) {
	redis.incr(request.params.uri);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});
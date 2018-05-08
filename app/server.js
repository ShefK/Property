var express = require('express');
var jsonQuery = require('json-query');

var bodyParser = require('body-parser');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

app.post('/workflow', function(req, res){
	var responseArray = [];
	var addressValue ='' ;
	req = req.body.payload.filter(function(o){
		return (o.workflow === 'completed' && o.type === 'htv');
	}).map(function(p){
        addressValue = Object.keys(p.address).map(key => p.address[key]).join(',');
       responseArray.push({address: addressValue,type: p.type, workflow:p.workflow})
	})
	
	// respond with json data
	res.json(responseArray)
  });

  app.use(function(err, req, res, next) {
	if (err.type === 'entity.parse.failed') {
	  res.status(400).json({"error": "Could not decode request: JSON parsing failed."})
	} else if (!req.body || !req.body.payload || !Array.isArray(req.body.payload)) {
	  res.status(400).json({error: "Invalid JSON structure: 'payload' missing or not array."});
	} else {
	  res.status(400).json({error: err.message}); // return specific error message
	}
  });

app.listen(port, function() {
    console.log('running');
});
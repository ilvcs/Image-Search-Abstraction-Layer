// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var Bing = require('node-bing-api')({ accKey: "30082622732a44c1a12c27ae1de222fd" });

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
   response.send("Hello")
});


app.get("/images", function (request, response) {
   Bing.images("Ninja Turtles", {
  count: 15,   // Number of results (max 50) 
  offset: 3    // Skip first 3 result 
  }, function(error, res, body){
    console.log(body);
  });
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

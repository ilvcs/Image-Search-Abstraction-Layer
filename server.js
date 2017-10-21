// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var keys = {'Key1': 'a6fd286a787d443dbfb2eec149e3ee97',

            'Key2': '30082622732a44c1a12c27ae1de222fd'}
var db_url = "mongodb://sdbuser:sdb1@ds127375.mlab.com:27375/sdb";
var Bing = require('node-bing-api')({ accKey: keys['Key2']});
var request = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));
var HDB = require('./searchHistory.js');
var mongoose = require('mongoose');
mongoose.connect(db_url);


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
   res.send("<html><h2>Hi! Add an extension to see the image search results</h2><p> Ex: https://img-abstraction.glitch.me/api/imagesearch/cats?offset=10<p> <h2>If you want to see the latest search results change url like shown below</h2><p> https://img-abstraction.glitch.me/api/latest/imagesearch</html>")
});


app.get("/api/imagesearch/:searchTerm*", function (req, res) {
  //res.json({req.params,req.query});
  var searchTerm = req.params.searchTerm;
  var offset = req.query.offset;
  

  
  var  url = `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${searchTerm}&count=${offset}`;
  //res.json({searchTerm,offset});
  var options = {
  url: url,
   headers : {
        'Ocp-Apim-Subscription-Key' : keys['Key2'],
    }
  };
  request(options, function(err,resp,body){
    var images = JSON.parse(body).value;
      var searchHistory = new HDB({term: searchTerm, when: Date.now()});
  searchHistory.save(function(err,data){
    if(err){
      res.send({"error":"Unable to save into the database"})
    }else{
      res.json(images);
    }
  })
    
  });
  //res.json(url);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.get("/api/latest/imagesearch", function (req, res) {
  
  HDB.find({}).sort({"when": -1}).select("term when -_id").limit(10).exec(function(err,data){
    if(err){
      res.send({"error": "problem retriving the data"})
    }else{
      res.json(data);
    } 
    
  });
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

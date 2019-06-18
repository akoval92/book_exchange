// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
// require("dotenv").config();
var express = require("express");
// var moment = require("moment");
// var axios = require("axios");
// var sequelize = require('sequelize');

// Adding Passport code
var passport = require('./app/config/passport');

// Import the API keys
// var keys = require("./keys");

// Initialize the API client using our client id and secret
// var google = new Amazon(keys.googleBooks);



var express = require("express");
var mysql = require("mysql");
var app = express();
var PORT = process.env.PORT || 8080;
// var PORT = process.env.PORT || 5050;


// Requiring our models for syncing
var db = require("./app/models");
// Enable fixtures to load data from file
const sequelize_fixtures = require('sequelize-fixtures');
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// We need to use sessions to keep track of our user's login status
const session = require('express-session')
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// Static directory

app.use(express.static("app/public"));          //res.render for all routes, cannot render with static

var exphbs = require("express-handlebars");       //*

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");         //*


// Routes
// =============================================================
// Routes
require("./app/routes/api-routes")(app);
require("./app/routes/html-routes")(app);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false, logging: console.log  })
.then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
}).then(function () { 
  // return sequelize_fixtures.loadFile('./seeds.json', db)

 })
.then(function(){
  console.log("data loaded");
});


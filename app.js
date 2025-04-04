//  Filename: app.js
//  Author: Patricia del Campillo

//  Import modules
var express = require('express');
var path = require('path');
var blogs = require('./routes/blogs');
var apiblogs = require('./routes/api/api-blogs');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
require('dotenv').config();

//  Initialize express application
var app = express(); 

//Connect mongoose
mongoose.connect(`mongodb+srv://pdelcampillo:Patty12!@cluster0.cv53hmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

//  Set up Pug as template engine
app.set('views', './views');  
app.set('view engine', 'pug');

//Bodyparser middleware
app.use(cookieParser('cscie31-secret'));
app.use(session({
  secret:"cscie31",
  resave: "true",
  saveUninitialized: "true"
}));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

//  Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

//  Use routes defined in blogs.js
app.use('/',blogs);

// Use api route
app.use('/api/blogs',apiblogs);

module.exports = app;


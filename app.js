// Require necessary packages
const express = require('express');
const https = require('https');
// Load the full build.
const _ = require('lodash');
const mongoose = require("mongoose");

// Create mongoose Schema instance
const Schema = mongoose.Schema;

// Connect to mongoDB
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true, // Ignore warnings
  useUnifiedTopology: true // Ignore warnings
});

// Create new blogSchema
const blogSchema = new Schema({
  // Define blog Schema properties
  // Post title
  title: {
    type: String,
    required: true
  },
  // Post body
  postContent: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Add timestamp to every post

// Define blog model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;

// Create express app instance
const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");

// Use middleware to recognize the incoming
// Request Objects as strings or arrays
app.use(express.urlencoded({
  extended: true
}));

// Serve static public folder
app.use(express.static("public"));

// Upon home GET request serve home.ejs file
app.get('/', function(req, res) {
  Blog.find({}, function(err, blog){
    if(err){
      console.log(err);
    }else{
      res.render('home', {
        postsArray: blog
      });
    }
  });
});

// Catch all GET requests targeted at /about directory
app.get('/about', function(req, res) {
  res.render('about', {
    // about: textAbout
  });
});

// Catch all GET requests targeted at /contact directory
app.get('/contact', function(req, res) {
  res.render('contact', {
    // contact: textContact
  });
});

// Catch all GET requests targeted at /blog directory
app.get('/blog', function(req, res) {
  res.render('blog', {
    // contact: textContact
  });
});

app.get('/posts/:id', function(req, res) {
  console.log(req.params.postName);
  // res.send("Reached");
  Blog.findById({_id: req.params.id}, function(err, blog){
    if(err){
      console.log(err);
    }else{
      res.render('post', {
        title: blog.title,
        content: blog.postContent
      });
    }
  });

});

// Catch all POST requests targeted at /blog directory
app.post('/blog', function(req, res) {

  // Store title and content in new blogPost document
  const blogPost = new Blog({
    title: req.body.publishPostTitle,
    postContent: req.body.publishPostText
  });

  //  Save post to mongoDb
  blogPost.save();

  // Redirect user to home '/'
  res.redirect('/');

});

// Tell server to listen on port localhost:3000
app.listen(3000, function() {
  console.log("Server is running on port 3000");
});

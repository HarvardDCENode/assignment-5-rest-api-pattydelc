//  Filename: blogs.js
//  Author: Patricia del Campillo

//  Import Modules
const express = require('express');
const router = express.Router();
var multer = require('multer');
var controller = require('../controllers/controller');
var Blog = require('../models/blogModel');
var flash = require('express-flash');
const path = require('path');
const BlogService = controller.BlogService;

//Define upload variable
var upload = multer({ storage: controller.storage, fileFilter: controller.imageFilter });

// Flash messaging
router.use(flash());

// Route: render homescreen
// List
router.get('/',(req, res) => {
    BlogService.list()
        .then((blogs) => {
            res.render('index', { 
                travelBlogs: blogs,
                flashMsg: req.flash('fileUploadError') || []
            });
            console.log("✅ Blogs fetched sucessfully");
        })
        .catch((err) => {
            console.error("❌ Error fetching blogs:", err);
            res.status(500).send("Error retrieving blogs. Please try again later.");
        });
});

// Route: Render update page
// Read
router.get('/blogs/:blogid', (req, res, next)=>{
    console.log("finding "+req.params.blogid);
    BlogService.read(req.params.blogid)
      .then((blog)=>{
        //Format date
        const formattedDate = formatdate(blog.date_of_travel);

        res.render('updateBlog', {
          blog: blog,
          flashMsg: req.flash("blogFindError") || [],
          formattedDate: formattedDate
        });
        console.log("✅ Blog fetched sucessfully");
      }).catch((err)=>{
        if (err) console.error("❌ Error fetching blog:", err);
      });
});

// Router: handle post update
// Update
router.post('/blogs/:blogid', (req, res, next)=>{
    var data  = {
        author: req.body.author,
        title: req.body.title,
        city: req.body.city,
        country: req.body.country,
        date_of_travel: req.body.date,
        blog: req.body.blog,
    };

    BlogService.update(req.params.blogid, data)
        .then((updatedBlog)=>{
            console.log("✅ Blog updated sucessfully");
            res.redirect('/');  
        })
        .catch((err)=>{
            console.error("❌ Error updating blog:", err);
        });
});

// Route: delete blog post
// Delete
router.post('/blogs/:blogid/delete', (req, res, next)=>{
    BlogService.delete(req.params.blogid)
        .then((blog)=>{
            res.redirect('/');
            console.log("✅ Blog deleted sucessfully");
        })
        .catch((err)=>{
            if(err) console.error("❌ Error deleting blog:", err);
        });
});

// Route: render travel blog page
// List
router.get('/blogs', (req, res, next) => {
    BlogService.list()
        .then((blogs) => {
            res.render('blogs', { 
                travelBlogs: blogs,
                flashMsg: req.flash('fileUploadError') || []
            });
            console.log("✅ Blogs fetched sucessfully");
        })
        .catch((err) => {
            console.error("❌ Error fetching blogs:", err);
            res.status(500).send("Error retrieving blogs. Please try again later.");
        });
});

// Route: handles form submissions and push entries to array
// Create
router.post('/blogs', upload.single('image'), async (req, res, next) => {
    const imageurl = req.file ? "/img/" + req.file.filename : null;

    const newBlogData = {
        author: req.body.author,
        title: req.body.title,
        city: req.body.city,
        country: req.body.country,
        date_of_travel: req.body.date,
        blog: req.body.blog,
        image: imageurl,
        date_posted: Date.now()
    };

    try {
        const savedBlog = await BlogService.create(newBlogData);
        res.redirect('/');
        console.log("✅ REST API: Blog post added successfully");
    } catch (err) {
        console.error("❌ REST API: Error saving blog post:", err);
        res.status(500).end();
    }
});

// Flash error messaging
router.use(function(err, req, res, next){
    console.error(err.stack);
    if (err.message == "OnlyImageFilesAllowed"){
        req.flash('fileUploadError',"Please select an image file with a jpg, png, or gif filename extension.");
        res.redirect('/blogs');
    } else if(err.message == "BlogSaveError") {
        req.flash('BlogSaveError',"There was a problem saving the blog :(");
        res.redirect('/blogs');
    } else {
       next(err);
    }
});

//  Exports router module
module.exports = router;


// Utility Functions

// formatdate()
function formatdate(date){
    return date.toISOString().split('T')[0];
}


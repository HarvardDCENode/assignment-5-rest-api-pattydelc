//  Filename: api-blogs.js
//  Author: Patricia del Campillo

//  Import Modules
const express = require('express');
const router = express.Router();
var multer = require('multer');
var controller = require('../../controllers/controller');
var Blog = require('../../models/blogModel');
const path = require('path');
const BlogService = controller.BlogService;

// Define upload variable
var upload = multer({ storage: controller.storage, fileFilter: controller.imageFilter });

// Set http headers for CORS and preflight
router.use((req, res, next)=>{
    res.set({
    // allow any domain, allow REST methods we've implemented
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
      "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers",
    // Set content-type for all api requests
      'Content-type':'application/json'
    });
    if (req.method == 'OPTIONS'){
      return res.status(200).end();
    }
    next();
});

// GET /blogs - List all blogs
router.get('/', (req, res, next)=>{
    BlogService.list()
        .then((blogs)=>{
            console.log(`✅ REST API: Found blogs: ${blogs}`);
            res.status(200);
            res.send(JSON.stringify(blogs));
        }).catch((err)=>{
            console.error("❌ REST API: Error fetching blogs:", err);
            res.status(404);
            res.end();
        });
});

// GET /blogs/:blogid - Find a single blog
router.get('/:blogid', (req, res, next)=>{
    BlogService.read(req.params.blogid)
        .then((blog)=>{
            res.status(200);
            res.send(JSON.stringify(blog));
            console.log(`✅ REST API: Found blog: ${blog}`);
        }).catch((err)=>{
            console.error("❌ REST API: Error fetching blog post:", err);
            res.status(404);
            res.end();
        });
});

// POST /blogs - Create new blog post
router.post('/', upload.single('image'), async (req, res, next) => {  

    console.log(`Posting new data`);
    console.log(`New blog data`, req.body);
    let imageurl = req.file ? "/img/" + req.file.filename : null;

    const newBlog = new Blog({
        author: req.body.author,
        title: req.body.title,
        city: req.body.city,
        country: req.body.country,
        date_of_travel: req.body.date_of_travel,
        blog: req.body.blog,
        image: imageurl,
        date_posted: Date.now()
    });

    try {
        const blogSave = await BlogService.create(newBlog);
        res.status(201);
        res.send(JSON.stringify(newBlog));
        console.log("✅ REST API: Blog post added successfully");
    } catch (err) {
        console.error("❌ REST API: Error saving blog post:", err);
        res.status(404);
        res.end();
    }
});

// /blogs/:blogid PUT - updates
router.put('/:blogid', (req, res, next)=>{
    console.log(`Putting ${req.params.blogid}`);
    let putdata = req.body;
    console.log(`Putting data`, putdata);
    BlogService.update(req.params.blogid, putdata)
        .then((updatedBlog)=>{
            console.log(`updated data`, updatedBlog);
            res.status(200);
            res.send(JSON.stringify(updatedBlog));            
            console.log("✅ REST API: Blog updated sucessfully");
        })
        .catch((err)=>{
            console.error("❌ REST API: Error updating blog:", err);
            res.status(404);
            res.end();
        });
});

// /blogs/:blogid DELETE - delete
router.delete('/:blogid', (req, res, next)=>{
    console.log(`Deleting blog  ${req.params.blogid}`);
    BlogService.delete(req.params.blogid)
        .then((blog)=> {
            res.status(200);
            res.send(JSON.stringify(blog));
            console.log(`✅ REST API: Blog deleted sucessfully`);

        }).catch((err)=> {
            console.error("❌ REST API: Error updating blog:", err);
            res.status(404);
            res.end();
        });
})


module.exports = router;

var multer = require('multer');
var path = require('path');
var Blog = require('../models/blogModel');


//Setup multer storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img');  // Save images in the public/img directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Create unique filenames
    }
});

const imageFilter = function(req, file, cb) {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif|JPGs)$/)){
      cb(null, true);
    }  else {
      cb(new Error("OnlyImageFilesAllowed"), false);
   }
}

class BlogService{
    // list
    static list(){
        return Blog.find({})
            .then((blogs)=>{
                return blogs;
            });
    }

    //read 
    static read(id){
        return Blog.findById(id)
            .then((blog)=>{
                return blog;
            });
    }

    //create
    static create(obj) {
        var blog = new Blog(obj);
        return blog.save();
    }

    //update
    static update(id,data) {
        return Blog.findById(id)
        .then((blog) => {
            blog.set(data);
            return blog.save();
        });
    }

    //delete
    static delete(id){
        return Blog.deleteOne({_id: id})
          .then((obj)=>{
            //removed
            return obj;
          })
    }
}

module.exports.storage = storage;
module.exports.imageFilter = imageFilter;
module.exports.BlogService = BlogService;

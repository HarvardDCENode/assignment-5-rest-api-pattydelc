var mongoose = require("mongoose");

//Get access to Schema constructor
var Schema = mongoose.Schema;

//create new Schema
const schema = new Schema({
    author: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    date_of_travel: {
        type: Date,
        required: true
    },
    blog: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String, // URL or file path
        default: null
    },
    date_posted: {
        type: Date,
        default: Date.now
    }
});

//export the modek wuth associeted name and schema
module.exports = mongoose.model("Blog", schema);
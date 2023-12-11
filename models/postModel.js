const mongoose = require('mongoose');

postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "please enter a title"]
    },
    body : {
        type : String,
        required : [true , "write here pls ! "]
    },
    author : {
        type : String,
    },
    authorId: {
        type : String,
    }


},
{timestamp : true});

module.exports = mongoose.model('Post', postSchema);
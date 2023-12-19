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
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User',
    }


},
{timestamp : true});

module.exports = mongoose.model('Post', postSchema);
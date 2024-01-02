const mongoose = require('mongoose');


userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : [true , "please enter your username"],
        unique : true,
    },
    email:{
        type : String ,
        required : [true, "please enter your email"],
    },
    password : {
        type : String ,
        required : [true , "please enter your password"],
    },

    verified : {type :Boolean, default : false },
    
},

{
    timestamp : true }
    );

module.exports = mongoose.model('User', userSchema);
    
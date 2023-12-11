const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


///////////////////////////////////////////////////////////////////////////
const registerUser = asyncHandler(async (req,res)=>{
    const {username , email , password } = await req.body;
    if( !username || !email || !password ){
        res.status(400);
        throw new Error("all fields are mandatory !");
    };
    ////////////////////
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!");
    };
    ////////////////////
    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        username,
        email,
        password : hashedPassword
    });
    console.log(`user created ${user}`);
    if(user){
        res.status(201).json({_id : user.id ,username : user.username, email : user.email});
    }else{
        res.status(400);
        throw new Error('Data is not valid');
    };
    res.json({message : "registred user"});

});
///////////////////////////////////////////////////////////

const loginUser = asyncHandler( async (req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error('all fields are mandetory');
    };
    const user = await User.findOne({email});
    //////////////////////////////////
    if(user && await bcrypt.compare(password,user.password)){
        const accessToken = jwt.sign({
            user : {
                username : user.username,
                email : user.email,
                id : user.id,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30m"},
        );
        res.status(200).json({accessToken})
    }else{
        res.status(401);
        throw new Error("email or password is not valid ! ")
    };
});

///////////////////////////:
const currentUser = asyncHandler(async (req,res)=>{
    res.status(200).json(req.user)});  



module.exports = {registerUser,loginUser, currentUser};
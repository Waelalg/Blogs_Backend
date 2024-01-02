const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/emailverif');
const { use } = require('../routes/userRoutes');


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
    /////////////////// generating verification token
    const token = new Token ({userId:user.id,
        token:crypto.randomBytes(16).toString('hex')
    });
    await token.save();
    console.log(token);
    
    console.log(`user created ${user}`);
    if(user){
        const message = `${process.env.BASE_URL}/verify/${user.id}/${token.token}`;
        await sendEmail(user.email, "Verify Email", message);
    }else{
        res.status(400);
        throw new Error('email not sent');
    };
    res.send("An Email sent to your account please verify");
    res.json({message : "registred user"});

});
///////////////////////////////////////////////////////////
const verifyUser = asyncHandler( async (req,res)=>{
    const user = await User.findOne({ _id: req.params.id });
    if (!user) { 
        res.status(400)
        throw new Error('user does not exist');
    }else{
    const token = await Token.findOne({
      userId: user.id,
      token: req.params.token,
    });
    if (!token) { 
        res.status(400).send("Invalid link")
        throw new Error('invalid link')
    };
    user.verified = true;
    await user.save();
    await Token.deleteOne({_id : token.id});}

    res.send("email verified sucessfully");

});
////////////////////////////////////////////////////////////

const loginUser = asyncHandler( async (req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error('all fields are mandetory');
    };
    const user = await User.findOne({email});
    //////////////////////////////////
    if(user && await bcrypt.compare(password,user.password)){
        if(user.verified==true){
        const accessToken = jwt.sign({
            user : {
                username : user.username,
                email : user.email,
                id : user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30m"},
        );
        res.status(200).json({accessToken})
    }else{
        res.status(401);
        throw new Error("user not verified : please verify ur email ")
    };
}else{
    res.status(401);
    throw new Error("ur password is wrong")
};})

///////////////////////////:
const currentUser = asyncHandler(async (req,res)=>{
    res.status(200).json(req.user)});  



module.exports = {registerUser,loginUser, currentUser, verifyUser};
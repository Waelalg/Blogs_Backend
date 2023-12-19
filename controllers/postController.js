const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');


const createPost = asyncHandler( async (req,res)=>{
    const {title , body} = await req.body;
    if(!title || !body){
        res.status(400);
        throw new Error('all fields are mandatory')
    };
    const post = await Post.create({
        title,
        body,
        author : req.user.username,
        authorId : req.user.id,
    });
    res.status(200).json(post);

});

const updatePost = asyncHandler( async (req,res)=>{
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true},
    );
    if(!post){
        res.status(404);
        throw new Error("post not found");
    };
    if(post.authorId != req.user.id){
        res.status(403);
        throw new Error("not authorized to edit others posts");
    }
    res.status(200).json(post);
});

const deletPost = asyncHandler( async (req,res)=> {
    const post = await Post.findById(req.params.id);
    if(!post){
        res.status(404);
        throw new Error('post not found');
    };
    if(post.authorId != req.user.id){
        res.status(403);
        throw new Error("not authorized to edit others posts");     
    };
    await post.deleteOne({_id : req.params.id});
    res.status(200).json(post);
})

module.exports = {updatePost,createPost,deletPost};
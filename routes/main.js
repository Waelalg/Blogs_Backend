const express = require('express');
const router = express.Router(); 
const {createPost,updatePost,deletPost} = require('../controllers/postController') 
const validateToken = require('../middlewares/validateTokenHandler');

router.post('/create',validateToken,createPost);
router.post('/update/:id',validateToken,updatePost);
router.delete('/delete/:id', validateToken,deletPost)

module.exports = router;
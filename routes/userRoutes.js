const express = require('express');
const router = express.Router(); 
const {registerUser,loginUser,currentUser,verifyUser} = require('../controllers/userController');
const validateToken = require('../middlewares/validateTokenHandler');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/current', validateToken,currentUser)
router.get('/verify/:id/:token',verifyUser)


module.exports = router;    
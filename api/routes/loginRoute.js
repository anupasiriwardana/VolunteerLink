const express = require('express');
const router = express.Router();

//importinig controller funcs
const {userLogin} = require('../controllers/userLoginController');

//common login route to all the user-roles : recruiter, volunteer, admin
router.post('/login',userLogin );

module.exports = router;
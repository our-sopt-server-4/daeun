var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const authUtil  = require('../middlewares/auth').checkToken;

router.post('/signup', userController.signup);
router.post('/signin',  userController.signin);
router.get('/profile/:id', authUtil, userController. readProfile);

module.exports = router;

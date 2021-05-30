const router = require('express').Router();
const { loginCtrl, signUpCtrl } = require('../Controllers/userCtrls');
const {
	signupValidator,
	loginValidator,
	doesUserExist,
} = require('../Middlewares/validator.middleware');

// login
router.post('/login', loginValidator, loginCtrl);

// sign up
router.post('/signup', signupValidator, doesUserExist, signUpCtrl);

module.exports = router;

const validator = require('../utils/validator');
const USER_MODEL = require('../Models/UserModel.js');
const signupValidator = (req, res, next) => {
	const validationRule = {
		email: 'required|email',
		firstName: 'required|string',
		lastName: 'required|string',
		password: 'required|string|min:6|strict',
	};
	validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				responseData: err.errors,
			});
		} else {
			next();
		}
	});
};
const loginValidator = (req, res, next) => {
	const validationRule = {
		email: 'required|email',
		password: 'required|string|min:6',
	};
	validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				responseData: err.errors,
			});
		} else {
			next();
		}
	});
};

const doesUserExist = async (req, res, next) => {
	const { email } = req.body;
	const existingUser = await USER_MODEL.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ message: 'User already exist' });
	}
	next();
};
module.exports = {
	signupValidator,
	loginValidator,
	doesUserExist,
};

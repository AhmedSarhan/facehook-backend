const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const USER_MODEL = require('../Models/UserModel');

const loginCtrl = async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await USER_MODEL.findOne({ email });
		if (!existingUser) {
			return res.status(404).json({
				success: false,
				responseData: null,
				message: "User doesn't exist",
			});
		}
		const isPasswordCorrect = bcrypt.compare(password, existingUser.password);
		if (!isPasswordCorrect) {
			return res.status(401).json({
				success: false,
				responseData: null,
				message: 'Wrong Credentials, Please try again',
			});
		}
		const token = jwt.sign(
			{ email: existingUser?.email, id: existingUser?._id },
			process.env.TOKEN_SECRET,
			{ expiresIn: '1w' }
		);
		res.status(200).json({
			success: true,
			responseData: {
				user: {
					email: existingUser?.email,
					id: existingUser?._id,
					firstName: existingUser?.firstName,
					lastName: existingUser?.lastName,
					avatar: existingUser?.avatar,
				},
				token,
			},
		});
	} catch (error) {}
};

const signUpCtrl = async (req, res) => {
	const { firstName, lastName, email, password, avatar } = req.body;

	let salt = await bcrypt.genSaltSync(10);
	let hashedPass = await bcrypt.hash(password, salt);

	const result = await USER_MODEL.create({
		email,
		firstName,
		lastName,
		password: hashedPass,
		avatar,
	});
	const token = jwt.sign(
		{ email: result.email, id: result._id },
		process.env.TOKEN_SECRET,
		{ expiresIn: '1w' }
	);

	let newUser = { ...result };
	delete newUser.password;
	res.status(200).json({
		success: true,
		responseData: {
			user: newUser,
			token,
		},
	});
	try {
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error,
		});
	}
};

module.exports = {
	loginCtrl,
	signUpCtrl,
};

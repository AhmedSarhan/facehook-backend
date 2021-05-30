const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];

		const isCustomAuth = token.length > 500;
		let decodedData;
		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, 'test');
			req.userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);
			req.userId = decodedData?.id;
		}
		next();
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error,
		});
	}
};

module.exports = authMiddleware;

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	avatar: String,
});

const USER_MODEL = mongoose.model('User', userSchema);

module.exports = USER_MODEL;

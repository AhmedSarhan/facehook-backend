const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
	text: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
	},
});

const COMMENT_MODEL = mongoose.model('Comment', commentSchema);

module.exports = COMMENT_MODEL;

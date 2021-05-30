const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	text: String,
	tags: [String],
	image: String,
	createdAt: {
		type: Date,
		default: new Date().toISOString(),
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
});

const POST_MODEL = mongoose.model('Post', postSchema);

module.exports = POST_MODEL;

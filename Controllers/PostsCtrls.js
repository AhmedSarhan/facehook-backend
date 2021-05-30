const mongoose = require('mongoose');
const POST_MODEL = require('../Models/PostModel');
const USER_MODEL = require('../Models/UserModel');
const COMMENT_MODEL = require('../Models/CommentModel');
const getPosts = async (req, res) => {
	try {
		const posts = await POST_MODEL.find()
			.populate('comments')
			.populate('author');
		return res.status(200).json({
			success: true,
			responseData: posts,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
};

const getUserPosts = async (req, res) => {
	try {
		const userId = req?.userId;
		USER_MODEL.findById(userId, async (err, user) => {
			if (err) throw new Error(err);
			const userPosts = await POST_MODEL.find({ author: user._id })
				.populate('comments')
				.populate('author');

			return res.status(200).json({
				success: true,
				responseData: userPosts,
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
};
const createPost = (req, res) => {
	try {
		const userId = req?.userId;
		const { title, text, tags, image } = req.body;
		USER_MODEL.findById(userId, (err, user) => {
			if (err) throw new Error(err);
			let newPost = {
				title,
				text,
				tags,
				image,
				author: user._id,
				comments: [],
			};
			POST_MODEL.create(newPost, (err, post) => {
				if (err) {
					return res.status(500).json({
						success: false,
						responseData: null,
						message: err.message,
					});
				}
				return res.status(200).json({
					success: true,
					responseData: post,
					message: 'Post created successfully',
				});
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
};
const updatePost = (req, res) => {
	try {
		const { id: _id } = req.params;
		const { text, tags, image } = req.body;
		const newPost = { text, tags, image };
		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).json({
				success: false,
				responseData: null,
				message: `No post found with that Id`,
			});
		}
		POST_MODEL.findByIdAndUpdate(
			_id,
			newPost,
			{
				new: true,
				useFindAndModify: false,
			},
			(err, updatedPost) => {
				if (err) throw new Error(err);
				return res.status(200).json({
					success: true,
					message: 'Post was updated successfully',
					responseData: null,
				});
			}
		);
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
};
const deletePost = async (req, res) => {
	try {
		const { id: _id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).json({
				success: false,
				message: 'No Post found',
				responseData: null,
			});
		}

		let foundPost = await POST_MODEL.findById(_id);
		COMMENT_MODEL.deleteMany({
			post: foundPost._id,
		}).then(() => {
			POST_MODEL.findByIdAndDelete(foundPost._id).then((response) => {
				return res.status(200).json({
					success: true,
					message: 'Post was deleted successfully',
					responseData: response,
				});
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
};

module.exports = {
	getPosts,
	getUserPosts,
	createPost,
	updatePost,
	deletePost,
};

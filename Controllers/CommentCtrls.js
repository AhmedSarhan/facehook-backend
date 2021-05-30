const mongoose = require('mongoose');
const POST_MODEL = require('../Models/PostModel');
const USER_MODEL = require('../Models/UserModel');
const COMMENT_MODEL = require('../Models/CommentModel');
const createComment = async (req, res) => {
	try {
		const userId = req?.userId;
		const { text, postId } = req.body;
		const commentAuthor = await USER_MODEL.findById(userId);
		let newComment = {
			text,
			author: commentAuthor._id,
		};
		COMMENT_MODEL.create(newComment).then((docComment) => {
			POST_MODEL.findByIdAndUpdate(
				postId,
				{ $push: { comments: docComment._id } },
				{ new: true, useFindAndModify: false }
			).then((updatedPost) => {
				return res.status(200).json({
					success: true,
					message: 'Comment added successfully',
					responseData: docComment,
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
const updateComment = (req, res) => {
	try {
		const { id: _id } = req.params;
		const { text } = req.body;
		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).json({
				success: false,
				message: 'No comment found',
				responseData: null,
			});
		}
		COMMENT_MODEL.findByIdAndUpdate(
			_id,
			{ text },
			{ new: true, useFindAndModify: false }
		).then((response) => {
			return res.status(200).json({
				success: true,
				message: 'Post updated successfully',
				responseData: response,
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
};
const deleteComment = async (req, res) => {
	try {
		const { id: _id } = req.params;
		const { postId } = req.body;

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).json({
				success: false,
				message: 'No comment found',
				responseData: null,
			});
		}
		const commentPost = await POST_MODEL.findById(postId);
		COMMENT_MODEL.findByIdAndDelete(_id)
			.then((response) => {
				POST_MODEL.findByIdAndUpdate(
					commentPost._id,
					{ $pull: { comments: _id } },
					{ new: true, useFindAndModify: false }
				);
			})
			.then(() => {
				return res.status(200).json({
					success: true,
					message: 'comment was deleted successfully',
					responseData: null,
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
	createComment,
	updateComment,
	deleteComment,
};

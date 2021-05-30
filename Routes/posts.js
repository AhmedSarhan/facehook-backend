const router = require('express').Router();
const {
	getPosts,
	getUserPosts,
	createPost,
	updatePost,
	deletePost,
} = require('../Controllers/PostsCtrls');
const authMiddleware = require('../Middlewares/Auth.middleware');

router.get('/', getPosts);
router.get('/userPosts', authMiddleware, getUserPosts);
router.post('/', authMiddleware, createPost);
router.patch('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;

const router = require('express').Router();
const {
	createComment,
	updateComment,
	deleteComment,
} = require('../Controllers/CommentCtrls');
const authMiddleware = require('../Middlewares/Auth.middleware');

// router.get('/', getComments);
// router.get('/userComments', authMiddleware, getUserComments);
router.post('/', authMiddleware, createComment);
router.patch('/:id', authMiddleware, updateComment);
router.post('/deleteComment/:id', authMiddleware, deleteComment);

module.exports = router;

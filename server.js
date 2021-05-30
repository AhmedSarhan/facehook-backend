const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// local imports
const userRoutes = require('./Routes/users');
const postRouters = require('./Routes/posts');
const commentRouters = require('./Routes/comments');

const app = express();

// cors
app.use(cors());
app.options('*', cors());

// connecting to db
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
const port = process.env.PORT || 8080;

db.on('onError', (error) => console.error(error));
db.once('open', () => console.error('connected to db'));
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRouters);
app.use('/comments', commentRouters);

app.listen(port, () => {
	console.log('app is well and running on port:' + port);
});

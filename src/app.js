require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./middleware/error-handler');
const authRouter = require('./auth/auth-router');
const userRouter = require('./user/user-router');
const mainRouter = require('./main/main-router');
const commentsRouter = require('./comments/comments-router');
const happeningRouter = require('./happening/happening-router');

const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

//Endpoints used for server
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/main', mainRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/happening', happeningRouter);

app.use(errorHandler);

module.exports = app;
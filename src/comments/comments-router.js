const express = require('express');
const path = require('path');
const CommentsService = require('./comments-service');
const { requireAuth } = require('../middleware/jwt-auth');
const xss = require('xss');

const commentsRouter = express.Router();
const jsonParser = express.json();

const serializeComment = comment => ({
  id: comment.id,
  user_comment: xss(comment.user_comment),
  user_name: comment.user_name,
  date_created: comment.date_created,
  media_id: comment.media_id,
  comment_timestamp: comment.comment_timestamp
});

commentsRouter
  .route('/:comment_thread')
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { user_comment, media_id, comment_timestamp } = req.body;
    const newComment = { user_comment, media_id, comment_timestamp };

    if(!user_comment) {
      return res.status(400).json( {error: 'User comment is required'} );
    }
    if(!comment_timestamp) {
      return res.status(400).json( {error: 'Comment timestamp is required'} );
    }
    
    newComment.user_name = req.user.username;

    const db = req.app.get('db');
    let commentTable = req.params.comment_thread;
    CommentsService.insertComment(db, commentTable, newComment)
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(serializeComment(comment));
      })
      .catch(next);
  });

module.exports = commentsRouter;
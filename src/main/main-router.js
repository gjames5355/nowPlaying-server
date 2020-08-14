const express = require('express');
const xss = require('xss');
const path = require('path');
const MainService = require('./main-service');
const { requireAuth } = require('../middleware/jwt-auth');

const mainRouter = express.Router();
const jsonParser = express.json();

const serializeThread = thread => ({
  id: thread.id,
  title: xss(thread.title),
  event_description: xss(thread.event_description),
  date_created: thread.date_created,
  media_runtime: thread.media_runtime,
  release_date: thread.release_date,
  genre: thread.genre,
  imdb_rating: thread.imdb_rating,
  mpaa_rating: thread.mpaa_rating,
  poster: thread.poster,
  movie_id: thread.movie_id,
  media_id: thread.media_id,
  backdrop: thread.backdrop,
  video_key: thread.video_key
});

mainRouter
  .route('/')
  .get((req,res,next) => {
    const db = req.app.get('db');
    MainService.getAllCategories(db)
      .then(categories => {
        return res.status(200).json(categories);
      })
      .catch(next);
  });

mainRouter
  .route('/:thread') 
  .get((req,res,next) => {

    const db = req.app.get('db');
    let mediaType = req.params.thread;

    const validMediaTypes = ['movies', 'tv_shows', 'podcasts', 'books'];
    let trueArray = [];

    for(let i = 0; i < validMediaTypes.length; i++) {
      if(mediaType === validMediaTypes[i]) {
        trueArray.push('matches');
      }
    }

    if(trueArray.length !== 1) {
      return res.status(404).json({error: 'Media type does not exist'});
    }

    MainService.getAllEntriesByMediaType(db,mediaType)
      .then(mediaTypes => {
        return res.status(200).json(mediaTypes.map(serializeThread));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req,res,next) => {
    const { title, event_description, media_runtime, release_date, genre, imdb_rating, mpaa_rating, poster, backdrop, movie_id, video_key } = req.body;
    const newThread = { title, event_description, media_runtime, release_date, genre, imdb_rating, mpaa_rating, poster, backdrop, movie_id, video_key };

    if(!title) {
      return res.status(400).json( {error: 'Title is required'} );
    }
    if(!media_runtime) {
      return res.status(400).json( {error: 'Media runtime is required'} );
    }

    const db = req.app.get('db');
    let mediaType = req.params.thread;
    
    let media_id;
    if(mediaType === 'movies') {
      media_id = 1;
    }
    if(mediaType === 'tv_shows') {
      media_id = 2;
    }
    if(mediaType === 'podcasts') {
      media_id = 3;
    }
    if(mediaType === 'books') {
      media_id = 4;
    }

    newThread.media_id = media_id;
    MainService.insertNewThread(db, mediaType, newThread)
      .then(thread => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl))
          .json(serializeThread(thread));
      })
      .catch(next);
  });

mainRouter
  .route('/:thread/:id')
  .get((req,res,next) => { 
    const db = req.app.get('db');
    let mediaType = req.params.thread;
    let id = req.params.id;

    MainService.getIndividualThread(db, mediaType, id)
      .then(thread => {
        let [ threadObject ] = thread;
        if(!threadObject) {
          return res.status(404).json( {error: 'Thread was not found'} );
        }
        return res.status(200).json(thread.map(serializeThread));
      })
      .catch(next);    
  });

mainRouter 
  .route('/:thread/:id/movie_comments') 
  .get((req,res,next) => {
    const db = req.app.get('db');
    let commentTable = 'movie_comments';
    let media_id = req.params.id;
    MainService.getCommentsForThread(db, commentTable, media_id)
      .then(comments => {
        return res.status(200).json(comments);
      })
      .catch(next);
  });

mainRouter
  .route('/:thread/:id/tv_show_comments')
  .get((req,res,next) => {
    const db = req.app.get('db');
    let commentTable = 'tv_show_comments';
    let media_id = req.params.id;
    MainService.getCommentsForThread(db, commentTable, media_id)
      .then(comments => {
        return res.status(200).json(comments);
      })
      .catch(next);
  });

mainRouter
  .route('/:thread/:id/podcast_comments')
  .get((req,res,next) => {
    const db = req.app.get('db');
    let commentTable = 'podcast_comments';
    let media_id = req.params.id;
    MainService.getCommentsForThread(db, commentTable, media_id)
      .then(comments => {
        return res.status(200).json(comments);
      })
      .catch(next);
  });

mainRouter
  .route('/:thread/:id/book_comments')
  .get((req,res,next) => {
    const db = req.app.get('db');
    let commentTable = 'book_comments';
    let media_id = req.params.id;
    MainService.getCommentsForThread(db, commentTable, media_id)
      .then(comments => {
        return res.status(200).json(comments);
      })
      .catch(next);
  });

module.exports = mainRouter;
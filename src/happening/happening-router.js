const express = require('express');
const xss = require('xss');
const path = require('path');
const HappeningService = require('./happening-service');
const { requireAuth } = require('../middleware/jwt-auth');

const happeningRouter = express.Router();
const jsonParser = express.json();

const serializeHappening = event => ({
  id: event.id,
  media_type: event.media_type,
  media_title: event.media_title,
  username: event.username,
  user_comment: xss(event.user_comment),
  media_title_comments: event.media_title_comments,
  date_created: event.date_created,
  media_id: event.media_id
});

happeningRouter
  .route('/')
  .get((req,res,next) => {
    const db = req.app.get('db');

    HappeningService.getAllHappeningEvents(db)
      .then(events => {
        return res.status(200).json(events.map(serializeHappening));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req,res,next) => {
    const db = req.app.get('db');
    const { media_type, media_title, username, user_comment, media_title_comments, media_id } = req.body;
    const newHappening = { media_type, media_title, username, user_comment, media_title_comments, media_id };

    if(!media_type) {
      return res.status(400).json( {error: 'Media type is required'} );
    }
    if(!media_id) {
      return res.status(400).json( {error: 'Media ID is required'} );
    }

    HappeningService.insertHappeningEvent(db, newHappening)
      .then(event => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${event.id}`))
          .json(serializeHappening(event));
      })
      .catch(next);
  });

happeningRouter
  .route('/:id')
  .all((req,res,next) => {
    const db = req.app.get('db');
    let id = req.params.id;

    HappeningService.getIndividualHappeningEvent(db,id)
      .then(event => {
        let [ happeningEvent ] = event;
        if(!happeningEvent) {
          return res.status(404).send({error: 'Event not found'});
        }
        res.event = event;
        next();
      })
      .catch(next);
  })
  .delete((req,res,next) => {
    const db = req.app.get('db');
    let id = req.params.id;

    HappeningService.deleteHappeningEvent(db,id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = happeningRouter;
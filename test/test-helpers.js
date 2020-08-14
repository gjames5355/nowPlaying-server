/* eslint-disable quotes */
const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      password: 'password',
      email: 'testemail1@email.com'
    },
    {
      id: 2,
      username: 'test-user-2',
      password: 'password',
      email: 'testemail2@email.com'
    },
  ];
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
            "user",
            "category",
            "movies",
            "tv_shows",
            "podcasts",
            "books",
            "movie_comments",
            "tv_show_comments",
            "podcast_comments",
            "book_comments"`
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE category_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE movies_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE tv_shows_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE podcasts_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE books_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE movie_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE tv_show_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE podcast_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE book_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('movies_id_seq', 0)`),
          trx.raw(`SELECT setval('movie_comments_id_seq', 0)`),
        ])
      )
  );
}
/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.transaction(async trx => {
    await trx.into('user').insert(preppedUsers);

    await trx.raw(
      `SELECT setval('user_id_seq', ?)`,
      [users[users.length - 1].id],
    );
  });
}

function makeMediaTypeArray(){
  return [
    {
      id: 1,
      title: 'First test thread',
      event_description: 'Setup thread for watching Frozen',
      date_created: '2019-01-01T14:10:50.615Z',
      media_id: 1, 
    },
    {
      id: 2,
      title: 'Second test thread',
      event_description: 'Setup thread for watching LOTR',
      date_created: '2019-01-01T14:10:50.615Z',
      media_id: 1, 
    },
    {
      id: 3,
      title: 'Third test thread',
      event_description: 'Setup thread for watching Goodfellas',
      date_created: '2019-01-01T14:10:50.615Z',
      media_id: 1, 
    }
  ];
}

function makeCommentsArray(){
  return [
    {
      id: 1,
      user_comment: 'First Test Comment',
      user_name: 'demo',
      date_created: '2019-01-01T14:10:50.615Z',
      media_id: 1,
    },
    {
      id: 2,
      user_comment: 'Second Test Comment',
      user_name: 'demo',
      date_created: '2019-01-01T14:10:50.615Z',
      media_id: 1,
    }, 
    {
      id: 3,
      user_comment: 'Third Test Comment',
      user_name: 'admin',
      date_created: '2019-01-01T14:10:50.615Z',
      media_id: 1,
    }
  ]; 
}

function makeExpectedMediaType(users, media, comments=[]){
  const user = users.find(user => user.id === user.user_id);
  const number_of_comments = comments.filter(comment => comment.media_id === media.id).length;

  return{
    id: media.id,
    title: media.title,
    event_description: media.event_description,
    date_created: media.date_created.toISOString(),
    media_id: media.media_id,
    number_of_comments,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    }
  };
}

function makeExpectedMediaTypeComments(users, mediaId, comments) {
  const expectedComments = comments.filter(comment => comment.media_id === mediaId);

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id);
    return {
      id: comment.id,
      user_comment: comment.user_comment,
      date_created: comment.date_created.toISOString(),
      media_id: comment.media_id,
      user: {
        id: commentUser.id,
        username: commentUser.username,
        email: commentUser.email,
      }
    };
  });
}

function seedMediaTables(db, media, users){
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('movies').insert(media);
    await trx.raw (
      `SELECT setval('movies_id_seq', ?)`,
      [media[media.length - 1].id],
    );
  });
}

function seedComments(db, comments=[]){
  return db.transaction(async trx => {
    await seedComments(trx, comments);
    await trx.into('movie_comments').insert(comments);
    await trx.raw (
      `SELECT setval('movie_comments_id_seq', ?)`,
      [comments[comments.length - 1].id],
    );
  });
}

function makeExpectedThreadComments(comment) {
  return {
    id: comment.id,
    user_comment: comment.user_comment,
    user_name: 'test-user-1',
    date_created: comment.date_created,
    comment_timestamp: comment.comment_timestamp,
    media_id: comment.media_id
  };
}

function makeMaliciousComment() {
  const maliciousComment = {
    id: 999,
    user_comment: 'Naughty naughty very naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    date_created: '2019-12-08T09:55:55.000Z',
    comment_timestamp: 200,
    media_id: 1
  };
  const expectedComment = {
    ...makeExpectedThreadComments(maliciousComment),
    user_comment: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
  };
  return {
    maliciousComment,
    expectedComment,
  };
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeAuthHeader,
  makeMediaTypeArray,
  makeCommentsArray,
  makeExpectedMediaType,
  makeExpectedMediaTypeComments,
  makeExpectedThreadComments,
  makeMaliciousComment,
  seedMediaTables,
  seedComments,
  seedUsers,
  cleanTables,
};
/* eslint-disable quotes */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xss = require('xss');

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

function makeHappeningsArray() {
  return [
    {
      id: 1,
      media_type: 'movies',
      media_title: 'Ratatouille',
      username: null,
      user_comment: null,
      media_title_comments: null,
      date_created: '2019-12-08T09:55:55.000Z',
      media_id: 1
    },
    {
      id: 2,
      media_type: 'movies',
      media_title: 'Toy Story 4',
      username: null,
      user_comment: null,
      media_title_comments: null,
      date_created: '2019-12-08T09:55:54.000Z',
      media_id: 1
    },
    {
      id: 3,
      media_type: 'movies',
      media_title: null,
      username: 'demo',
      user_comment: 'This part is awesome!',
      media_title_comments: 'Lion King',
      date_created: '2019-12-08T09:55:50.000Z',
      media_id: 2
    },
    {
      id: 4,
      media_type: 'movies',
      media_title: null,
      username: 'admin',
      user_comment: 'Awww the movie is over',
      media_title_comments: 'The Incredibles',
      date_created: '2019-05-04T09:20:19.000Z',
      media_id: 2
    }
  ];
}

function makeExpectedHappenings(happening) {
  return {
    id: happening.id,
    media_type: happening.media_type,
    media_title: happening.media_title,
    username: happening.username,
    user_comment: xss(happening.user_comment),
    media_title_comments: happening.media_title_comments,
    date_created: happening.date_created,
    media_id: happening.media_id
  };
}

function makeMaliciousHappening() {
  const maliciousHappening = {
    id: 911,
    media_type: 'movies',
    media_title: null,
    username: 'demo',
    user_comment: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    media_title_comments: 'Ratatouille',
    date_created: '2019-05-04T09:20:19.000Z',
    media_id: 1,
  };
  const expectedHappening = {
    ...makeExpectedHappenings(maliciousHappening),
    user_comment: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousHappening,
    expectedHappening,
  };
}

function makeHappeningFixtures() {
  const testUsers = makeUsersArray();
  const testHappenings = makeHappeningsArray();
  return { testUsers, testHappenings };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
          "happening",
          "book_comments",
          "podcast_comments",
          "tv_show_comments",
          "movie_comments",
          "books",
          "podcasts",
          "tv_shows",
          "movies",
          "category",
          "user"`
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE happening_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE book_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE podcast_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE tv_show_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE movie_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE books_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE podcasts_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE tv_shows_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE movies_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE category_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
        ])
      )
  );
}

function seedHappenings(db, users, happenings) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('happening').insert(happenings);
    await trx.raw(
      `SELECT setval('happening_id_seq', ?)`,
      [happenings[happenings.length - 1].id],
    );
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

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

module.exports = {
  makeUsersArray,
  makeHappeningsArray,
  makeExpectedHappenings,
  makeMaliciousHappening,
  
  makeHappeningFixtures,
  cleanTables,
  seedHappenings,
  makeAuthHeader,
  seedUsers
};
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

function makeCategoryArray() {
  return [
    {
      id: 1,
      media_type: 'movies',
      media_name: 'Movies'
    },
    {
      id: 2,
      media_type: 'tv_shows',
      media_name: 'TV Shows'
    },
    {
      id: 3,
      media_type: 'podcasts',
      media_name: 'Podcasts'
    },
    {
      id: 4,
      media_type: 'books',
      media_name: 'Books'
    }
  ];
}

function makeThreadArray(category) {
  return [
    {
      id: 1,
      title: 'Movie 1',
      event_description: 'Lorem ipsum',
      date_created: '2019-12-08T00:00:00.000Z',
      media_runtime: 130,
      release_date: '2019-01-15',
      genre: 'Action',
      imdb_rating: 7,
      mpaa_rating: 'PG',
      poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
      backdrop: 'example',
      movie_id: 120,
      media_id: category.id,
      video_key: 'test'
    },
    {
      id: 2,
      title: 'Movie 2',
      event_description: 'Lorem ipsum',
      date_created: '2019-12-08T00:00:00.000Z',
      media_runtime: 150,
      release_date: '2014-05-23',
      genre: 'Comedy',
      imdb_rating: 6,
      mpaa_rating: 'PG-13',
      poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
      backdrop: 'example',
      movie_id: 11323,
      media_id: category.id,
      video_key: 'test'
    },
    {
      id: 3,
      title: 'Movie 3',
      event_description: 'Lorem ipsum',
      date_created: '2018-12-08T00:00:00.000Z',
      media_runtime: 125,
      release_date: '1990-02-28',
      genre: 'Romance',
      imdb_rating: 5,
      mpaa_rating: 'R',
      poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
      backdrop: 'example',
      movie_id: 22250,
      media_id: category.id,
      video_key: 'test'
    },
    {
      id: 4,
      title: 'Movie 4',
      event_description: 'Lorem ipsum',
      date_created: '2019-05-04T00:00:00.000Z',
      media_runtime: 113,
      release_date: '2014-03-05',
      genre: 'Thriller',
      imdb_rating: 2,
      mpaa_rating: 'G',
      poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
      backdrop: 'example',
      movie_id: 150,
      media_id: category.id,
      video_key: 'test'
    },
  ];
}

function makeThreadCommentsArray(users, threads) {
  return [
    {
      id: 1,
      user_comment: 'Comment 1',
      user_name: users[0].username,
      date_created: '2019-12-08T09:55:55.000Z',
      comment_timestamp: 500,
      media_id: threads[0].id,
    },
    {
      id: 2,
      user_comment: 'Comment 2',
      user_name: users[0].username,
      date_created: '2019-12-08T09:55:54.000Z',
      comment_timestamp: 600,
      media_id: threads[1].id,
    },
    {
      id: 3,
      user_comment: 'Comment 3',
      user_name: users[1].username,
      date_created: '2018-12-08T09:55:50.000Z',
      comment_timestamp: 200,
      media_id: threads[2].id,
    },
    {
      id: 4,
      user_comment: 'Comment 4',
      user_name: users[1].username,
      date_created: '2019-05-04T09:20:19.000Z',
      comment_timestamp: 800,
      media_id: threads[3].id,
    },
  ];
}

function makeExpectedCategories(category) {
  return {
    id: category.id,
    media_type: category.media_type,
    media_name: category.media_name
  };
}

function makeExpectedThreads(thread) {
  return {
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
    backdrop: thread.backdrop,
    movie_id: thread.movie_id,
    media_id: thread.media_id,
    video_key: thread.video_key
  };
}

function makeExpectedThreadComments(comment) {
  return {
    id: comment.id,
    user_comment: comment.user_comment,
    user_name: comment.user_name,
    date_created: comment.date_created,
    comment_timestamp: comment.comment_timestamp,
    media_id: comment.media_id
  };
}

function makeMaliciousThread() {
  const maliciousThread = {
    id: 999,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    event_description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    date_created: '2019-12-08T09:55:55.000Z',
    media_runtime: 130,
    release_date: '2019-01-15',
    genre: 'Action',
    imdb_rating: 7,
    mpaa_rating: 'PG',
    poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
    backdrop: 'example',
    movie_id: 120,
    media_id: 1,
    video_key: 'test'
  };
  const expectedThread = {
    ...makeExpectedThreads(maliciousThread),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    event_description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousThread,
    expectedThread,
  };
}

function makeThreadFixtures() {
  const testUsers = makeUsersArray();
  const testCategories = makeCategoryArray();
  const testThreads = makeThreadArray(testCategories[0]);
  const testComments = makeThreadCommentsArray(testUsers, testThreads);
  return { testUsers, testCategories, testThreads, testComments };
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

function seedCategories(db, categories) {
  return db.transaction(async trx => {
    await trx.into('category').insert(categories);
    await trx.raw(
      `SELECT setval('happening_id_seq', ?)`,
      [categories[categories.length - 1].id],
    );
  });
}

function seedThreads(db, users, categories, threads) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await seedCategories(trx, categories);
    await trx.into('movies').insert(threads);
    await trx.raw(
      `SELECT setval('movies_id_seq', ?)`,
      [threads[threads.length - 1].id],
    );
  });
}

function seedThreadComments(db, users, categories, threads, comments) {
  return db.transaction(async trx => {
    await seedThreads(trx, users, categories, threads);
    await trx.into('movie_comments').insert(comments);
    await trx.raw(
      `SELECT setval('movie_comments_id_seq', ?)`,
      [comments[comments.length - 1].id],
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
  makeCategoryArray,
  makeThreadArray,
  makeThreadCommentsArray,
  makeExpectedCategories,
  makeExpectedThreads,
  makeExpectedThreadComments,
  makeMaliciousThread,

  makeThreadFixtures,
  cleanTables,
  seedCategories,
  seedThreads,
  seedThreadComments,
  makeAuthHeader,
  seedUsers
};
const app = require('../src/app');
const mainHelpers = require('./main-helpers');
const knex = require('knex');

describe('Main endpoints', function () {
  let db;

  const { testUsers, testCategories, testThreads, testComments } = mainHelpers.makeThreadFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from DB', () => db.destroy());

  before('cleanup', () => mainHelpers.cleanTables(db));

  afterEach('cleanup', () => mainHelpers.cleanTables(db));

  describe('GET /api/main', () => {
    context('Given no data', () => {
      it('responds with 200 and an empty category list', () => {
        return supertest(app)
          .get('/api/main')
          .expect(200, []);
      });
    });

    context('Given there are categories in the DB', () => {
      beforeEach('Insert categories', () => 
        mainHelpers.seedCategories(db, testCategories)
      );
      it('responds with 200 and all categories', () => {
        const expectedCategories = testCategories.map(category => 
          mainHelpers.makeExpectedCategories(category)
        );
        return supertest(app)
          .get('/api/main')
          .expect(200, expectedCategories);
      });
    });
  });

  describe('GET /api/main/:thread', () => {
    context('Given no data', () => {
      it('responds with 200 and empty list', () => {
        const thread = 'movies';
        return supertest(app)
          .get(`/api/main/${thread}`)
          .expect(200, []);
      });
    });

    context('Given there are movies in the database', () => {
      beforeEach('Insert threads', () => 
        mainHelpers.seedThreads(db, testUsers, testCategories, testThreads)
      );

      it('responds with 200 and all the movies', () => {
        const expectedMovies = testThreads.map(thread =>
          mainHelpers.makeExpectedThreads(thread)
        );
        const thread = 'movies';
        return supertest(app)
          .get(`/api/main/${thread}`)
          .expect(200, expectedMovies);
      });
      
      it('responds with 404 when thread type does not exist', () => {
        const thread = 'bogus';
        return supertest(app)
          .get(`/api/main/${thread}`)
          .expect(404, {error: 'Media type does not exist'});
      });
    });

    context('Given an XSS attack', () => {
      const { maliciousThread, expectedThread } = mainHelpers.makeMaliciousThread();
      const thread = 'movies';
      beforeEach('Insert malicious thread', () => 
        mainHelpers.seedThreads(db, testUsers, testCategories, [maliciousThread])
      );

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/main/${thread}`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedThread.title);
            expect(res.body[0].event_description).to.eql(expectedThread.event_description);
          });
      });
    });
  });

  describe('POST /api/main/:thread', () => {
    beforeEach('Insert threads', () => 
      mainHelpers.seedThreads(db, testUsers, testCategories, testThreads)
    );

    it('responds with 400 missing title if not supplied', () => {
      const newThreadMissingTitle = {
        event_description: 'Lorem ipsum',
        date_created: '2019-05-04T00:20:19.000Z',
        media_runtime: 113,
        release_date: '2014-03-05',
        genre: 'Thriller',
        imdb_rating: 2,
        mpaa_rating: 'G',
        poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
        movie_id: 150,
        media_id: 1
      };
      const thread = 'movies';
      return supertest(app)
        .post(`/api/main/${thread}`)
        .send(newThreadMissingTitle)
        .set('Authorization', mainHelpers.makeAuthHeader(testUsers[0]))
        .expect(400, {error: 'Title is required'});
    });

    it('responds with 400 missing media_runtime if not supplied', () => {
      const newThreadMissingRuntime = {
        title: 'Example',
        event_description: 'Lorem ipsum',
        date_created: '2019-05-04T00:20:19.000Z',
        release_date: '2014-03-05',
        genre: 'Thriller',
        imdb_rating: 2,
        mpaa_rating: 'G',
        poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
        movie_id: 150,
        media_id: 1
      };
      const thread = 'movies';
      return supertest(app)
        .post(`/api/main/${thread}`)
        .send(newThreadMissingRuntime)
        .set('Authorization', mainHelpers.makeAuthHeader(testUsers[0]))
        .expect(400, {error: 'Media runtime is required'});
    });

    it('responds with 201 and adds a new thread', () => {
      const newThread = {
        title: 'Movie 3',
        event_description: 'Lorem ipsum',
        media_runtime: 125,
        release_date: '1990-02-28',
        genre: 'Romance',
        imdb_rating: 5,
        mpaa_rating: 'R',
        poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
        backdrop: 'example',
        movie_id: 22250,
        media_id: 1
      };
      const thread = 'movies';
      return supertest(app)
        .post(`/api/main/${thread}`)
        .send(newThread)
        .set('Authorization', mainHelpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newThread.title);
          expect(res.body.event_description).to.eql(newThread.event_description);
          expect(res.body.media_runtime).to.eql(newThread.media_runtime);
          expect(res.body.release_date).to.eql(newThread.release_date);
          expect(res.body.genre).to.eql(newThread.genre);
          expect(res.body.imdb_rating).to.eql(newThread.imdb_rating);
          expect(res.body.mpaa_rating).to.eql(newThread.mpaa_rating);
          expect(res.body.poster).to.eql(newThread.poster);
          expect(res.body.movie_id).to.eql(newThread.movie_id);
          expect(res.body.media_id).to.eql(newThread.media_id);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/main/${thread}`);
        });
    });

    it('removes XSS attack content from response', () => {
      before('Insert threads', () => 
        mainHelpers.seedThreads(db, testUsers, testCategories, testThreads)
      );
      const { maliciousThread, expectedThread } = mainHelpers.makeMaliciousThread();
      const thread = 'movies';

      return supertest(app)
        .post(`/api/main/${thread}`)
        .send(maliciousThread)
        .set('Authorization', mainHelpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(expectedThread.title);
          expect(res.body.event_description).to.eql(expectedThread.event_description);
          expect(res.body.media_runtime).to.eql(expectedThread.media_runtime);
          expect(res.body.release_date).to.eql(expectedThread.release_date);
          expect(res.body.genre).to.eql(expectedThread.genre);
          expect(res.body.imdb_rating).to.eql(expectedThread.imdb_rating);
          expect(res.body.mpaa_rating).to.eql(expectedThread.mpaa_rating);
          expect(res.body.poster).to.eql(expectedThread.poster);
          expect(res.body.movie_id).to.eql(expectedThread.movie_id);
          expect(res.body.media_id).to.eql(expectedThread.media_id);
          expect(res.body).to.have.property('id');
        });
    });
  });

  describe('GET /api/main/:thread/:id', () => {
    context('Given no data', () => {
      it('responds with 404 not found', () => {
        const id = 99999;
        const thread = 'movies';
        return supertest(app)
          .get(`/api/main/${thread}/${id}`)
          .expect(404, {error: 'Thread was not found'});
      });
    });

    context('Given there are threads in the database', () => {
      beforeEach('Insert threads', () =>
        mainHelpers.seedThreads(db, testUsers, testCategories, testThreads)
      );

      it('responds with 200 and the specified thread', () => {
        const id = 1;
        const expectedThread = mainHelpers.makeExpectedThreads(testThreads[id - 1]);
        const thread = 'movies';

        return supertest(app)
          .get(`/api/main/${thread}/${id}`)
          .expect(200, [expectedThread]);
      });
    });

    context('Given an XSS attack thread', () => {
      const { maliciousThread, expectedThread } = mainHelpers.makeMaliciousThread();
      const thread = 'movies';
      beforeEach('Insert threads', () => 
        mainHelpers.seedThreads(db, testUsers, testCategories, [maliciousThread])
      );

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/main/${thread}/${maliciousThread.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedThread.title);
            expect(res.body[0].event_description).to.eql(expectedThread.event_description);
          });
      });
    });
  });

  describe('GET /api/main/:thread/:id/movie_comments', () => {
    context('Given no data', () => {
      it('responds with 200 and an empty list', () => {
        const thread = 'movies';
        const id = 1;
        return supertest(app)
          .get(`/api/main/${thread}/${id}/movie_comments`)
          .expect(200, []);
      });
    });

    context('Given there are comments in the database', () => {
      beforeEach('Insert movies', () =>
        mainHelpers.seedThreadComments(db, testUsers, testCategories, testThreads, testComments)
      );
      it('responds with 200 and all movie comments', () => {
        const thread = 'movies';
        const id = 1;
        const comments = testComments.map(comment =>
          mainHelpers.makeExpectedThreadComments(comment)
        );
        const expectedComments = comments.filter(comment => comment.media_id === id);
        return supertest(app)
          .get(`/api/main/${thread}/${id}/movie_comments`)
          .expect(200, expectedComments);
      });
    });
  });
});
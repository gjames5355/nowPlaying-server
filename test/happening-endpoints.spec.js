const app = require('../src/app');
const happeningHelpers = require('./happening-helpers');
const knex = require('knex');

describe('Happenings Endpoints', function () {
  let db;

  const { testUsers, testHappenings } = happeningHelpers.makeHappeningFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from DB', () => db.destroy());

  before('cleanup', () => happeningHelpers.cleanTables(db));

  afterEach('cleanup', () => happeningHelpers.cleanTables(db));

  describe('GET /api/happening', () => {
    context('Given no happenings', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/happening')
          .expect(200, []);
      });
    });

    context('Given there are happenings in the database', () => {
      beforeEach('Insert happenings', () =>
        happeningHelpers.seedHappenings(db, testUsers, testHappenings)
      );
      it('responds with 200 and all happenings', () => {
        const expectedHappenings = testHappenings.map(event =>
          happeningHelpers.makeExpectedHappenings(event)
        );
        return supertest(app)
          .get('/api/happening')
          .expect(200, expectedHappenings);
      });
    });

    context('Given an XSS attack', () => {
      const { maliciousHappening, expectedHappening } = happeningHelpers.makeMaliciousHappening();

      beforeEach('Insert malicious show', () =>
        happeningHelpers.seedHappenings(db, testUsers, [maliciousHappening])
      );

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/api/happening')
          .expect(200)
          .expect(res => {
            expect(res.body[0].user_comment).to.eql(expectedHappening.user_comment);
          });
      });
    });
  });

  describe('POST /api/happening', () => {
    beforeEach('Insert happenings and users', () =>
      happeningHelpers.seedHappenings(db, testUsers, testHappenings)
    );

    it('responds with 400 missing media_type if not supplied', () => {
      const newHappeningMissingMediaType = {
        media_title: null,
        username: 'demo',
        user_comment: 'This part is awesome!',
        media_title_comments: 'Lion King',
        date_created: '2019-12-08T09:55:50.000Z',
        media_id: 2
      };
      return supertest(app)
        .post('/api/happening')
        .send(newHappeningMissingMediaType)
        .set('Authorization', happeningHelpers.makeAuthHeader(testUsers[0]))
        .expect(400, { error: 'Media type is required' });
    });

    it('responds with 400 missing media_id if not supplied', () => {
      const newHappeningMissingMediaID = {
        media_type: 'movies',
        media_title: null,
        username: 'demo',
        user_comment: 'This part is awesome!',
        media_title_comments: 'Lion King',
        date_created: '2019-12-08T09:55:50.000Z',
      };
      return supertest(app)
        .post('/api/happening')
        .send(newHappeningMissingMediaID)
        .set('Authorization', happeningHelpers.makeAuthHeader(testUsers[0]))
        .expect(400, { error: 'Media ID is required' });
    });

    it('responds 201 and adds a new happening event', () => {
      const newHappening = {
        media_type: 'movies',
        media_title: null,
        username: 'demo',
        user_comment: 'This part is awesome!',
        media_title_comments: 'Lion King',
        date_created: '2019-12-08T09:55:50.000Z',
        media_id: 1
      };
      return supertest(app)
        .post('/api/happening')
        .send(newHappening)
        .set('Authorization', happeningHelpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.media_type).to.eql(newHappening.media_type);
          expect(res.body.media_title).to.eql(newHappening.media_title);
          expect(res.body.username).to.eql(newHappening.username);
          expect(res.body.user_comment).to.eql(newHappening.user_comment);
          expect(res.body.media_title_comments).to.eql(newHappening.media_title_comments);
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
          const actualDate = new Date(res.body.date_created).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
          expect(res.body.media_id).to.eql(newHappening.media_id);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/happening/${res.body.id}`);
        });
    });

    it('Removes XSS attack content from response', () => {
      const { maliciousHappening, expectedHappening } = happeningHelpers.makeMaliciousHappening();

      return supertest(app)
        .post('/api/happening')
        .send(maliciousHappening)
        .set('Authorization', happeningHelpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.media_type).to.eql(expectedHappening.media_type);
          expect(res.body.media_title).to.eql(expectedHappening.media_title);
          expect(res.body.username).to.eql(expectedHappening.username);
          expect(res.body.user_comment).to.eql(expectedHappening.user_comment);
          expect(res.body.media_title_comments).to.eql(expectedHappening.media_title_comments);
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
          const actualDate = new Date(res.body.date_created).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
          expect(res.body.media_id).to.eql(expectedHappening.media_id);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/happening/${res.body.id}`);
        });
    });
  });

  describe('DELETE /api/happening/:id', () => {
    context('Given that data does not exist', () => {
      before('Insert happenings', () =>
        happeningHelpers.seedHappenings(db, testUsers, testHappenings)
      );

      it('responds with a 404 status with message of not found', () => {
        const id = 9999;
        return supertest(app)
          .delete(`/api/happening/${id}`)
          .expect(404, { error: 'Event not found' });
      });
    });

    context('Given that data exists', () => {
      beforeEach('Insert happenings', () =>
        happeningHelpers.seedHappenings(db, testUsers, testHappenings)
      );

      it('responds with a status of 204 and deletes the event', () => {
        const id = 1;
        const expectedResult = testHappenings.filter(event => event.id !== id);

        return supertest(app)
          .delete(`/api/happening/${id}`)
          .expect(204)
          .then(() => {
            supertest(app)
              .get('/api/happening')
              .expect(200, expectedResult);
          });
      });
    });
  });
});
/* eslint-disable quotes */
const app = require('../src/app');
const helpers = require('./test-helpers');
const mainHelpers = require('./main-helpers');

describe('Comment Endpoints', function () {
  let db;
  
  const testUsers = helpers.makeUsersArray();
  const { testCategories, testThreads, testComments } = mainHelpers.makeThreadFixtures();
  
  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });
  
  after('disconnect from db', () => db.destroy());
  
  before('cleanup', () => helpers.cleanTables(db));
  
  afterEach('cleanup', () => helpers.cleanTables(db));

  /**
    * @description Posts a user comment
    **/
  describe(`POST /api/comments/:comment_thread'`, () => {
    beforeEach('insert comments', () =>
      mainHelpers.seedThreadComments(
        db,
        testUsers, 
        testCategories, 
        testThreads,
        testComments,
      )
    );
    it(`creates a comment, responding with 201 and the new comment`, function() {
      this.retries(3);
      const testUser = testUsers[0];
      const newComment = {
        user_comment: 'Test new comment',
        user_name: 'test-user-1',
        date_created: '2019-12-10T19:11:36.000Z',
        comment_timestamp: 200,
        media_id: 1,
      };
      const comment_thread = 'movie_comments';
      return supertest(app)
        .post(`/api/comments/${comment_thread}`)
        .send(newComment)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(201)
        .expect(res => {
          expect(res.body.user_comment).to.eql(newComment.user_comment);
          expect(res.body.user_name).to.eql(newComment.user_name);
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
          const actualDate = new Date(res.body.date_created).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
          expect(res.body.comment_timestamp).to.eql(newComment.comment_timestamp);
          expect(res.body.media_id).to.eql(newComment.media_id);
        });
    });
    it('responds with 400 missing user comment if not supplied', () => {
      const newCommentMissingUserComment = {
        user_name: 'test-user-1',
        date_created: '2019-12-10T19:11:36.000Z',
        comment_timestamp: 200,
        media_id: 1,
      };
      const comment_thread = 'movie_comments';
      return supertest(app)
        .post(`/api/comments/${comment_thread}`)
        .send(newCommentMissingUserComment)
        .set('Authorization', mainHelpers.makeAuthHeader(testUsers[0]))
        .expect(400, {error: 'User comment is required'});
    });
    it('responds with 400 missing user comment if not supplied', () => {
      const newCommentMissingTimestamp = {
        user_comment: 'Test new comment',
        user_name: 'test-user-1',
        date_created: '2019-12-10T19:11:36.000Z',
        media_id: 1,
      };
      const comment_thread = 'movie_comments';
      return supertest(app)
        .post(`/api/comments/${comment_thread}`)
        .send(newCommentMissingTimestamp)
        .set('Authorization', mainHelpers.makeAuthHeader(testUsers[0]))
        .expect(400, {error: 'Comment timestamp is required'});
    });
    it('removes XSS attack content from response', () => { 
      before('Insert comments', () => 
        mainHelpers.seedThreadComments(
          db,
          testUsers, 
          testCategories, 
          testThreads,
          testComments,
        )
      );
      const { maliciousComment, expectedComment } = helpers.makeMaliciousComment();
      const comment_thread = 'movie_comments';
  
      return supertest(app)
        .post(`/api/comments/${comment_thread }`)
        .send(maliciousComment)
        .set('Authorization', mainHelpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.user_comment).to.eql(expectedComment.user_comment);
          expect(res.body.user_name).to.eql(expectedComment.user_name);
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
          const actualDate = new Date(res.body.date_created).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
          expect(res.body.media_id).to.eql(expectedComment.media_id);
        });
    });
  });
});
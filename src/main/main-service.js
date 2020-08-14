const MainService = {
  getAllCategories(db) {
    return db
      .from('category')
      .select('*');
  },

  getAllEntriesByMediaType(db, mediaType) {
    return db
      .from(mediaType)
      .select('*');
  },

  getIndividualThread(db, mediaType, id) {
    return db
      .from(mediaType)
      .select('*')
      .where( {id} );
  },

  getCommentsForThread(db, commentTable, media_id) {
    return db
      .from(commentTable)
      .select('*')
      .where( {media_id} );
  },

  insertNewThread(db, mediaType, newThread) {
    return db
      .insert(newThread)
      .into(mediaType)
      .returning('*')
      .then(res => res[0]);
  }
};

module.exports = MainService;
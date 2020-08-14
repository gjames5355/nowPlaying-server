const CommentsService = {
  insertComment(db, commentTable, newComment) {
    return db
      .insert(newComment)
      .into(commentTable)
      .returning('*')
      .then(([comment]) => comment);
  }
};
  
module.exports = CommentsService;
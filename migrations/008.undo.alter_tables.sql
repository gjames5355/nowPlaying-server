ALTER TABLE "book_comments"
  DROP COLUMN IF EXISTS media_id;

ALTER TABLE "podcast_comments"
  DROP COLUMN IF EXISTS media_id;

ALTER TABLE "tv_show_comments"
  DROP COLUMN IF EXISTS media_id;

ALTER TABLE "movie_comments"
  DROP COLUMN IF EXISTS media_id;

ALTER TABLE "books"
  DROP COLUMN IF EXISTS media_id;

ALTER TABLE "podcasts"
  DROP COLUMN IF EXISTS media_id;

ALTER TABLE "tv_shows"
  DROP COLUMN IF EXISTS media_id;

ALTER TABLE "movies"
  DROP COLUMN IF EXISTS media_id;
CREATE TABLE "movie_comments" (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_comment TEXT NOT NULL,
  user_name TEXT REFERENCES "user"(username) ON DELETE SET NULL NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  comment_timestamp INTEGER NOT NULL
);

CREATE TABLE "tv_show_comments" (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_comment TEXT NOT NULL,
  user_name TEXT REFERENCES "user"(username) ON DELETE SET NULL NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  comment_timestamp INTEGER NOT NULL
);

CREATE TABLE "podcast_comments" (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_comment TEXT NOT NULL,
  user_name TEXT REFERENCES "user"(username) ON DELETE SET NULL NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  comment_timestamp INTEGER NOT NULL
);

CREATE TABLE "book_comments" (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_comment TEXT NOT NULL,
  user_name TEXT REFERENCES "user"(username) ON DELETE SET NULL NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  comment_timestamp INTEGER NOT NULL
);
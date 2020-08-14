BEGIN;

TRUNCATE
    "user",
    "category",
    "movies",
    "tv_shows",
    "podcasts",
    "books",
    "movie_comments",
    "tv_show_comments",
    "podcast_comments",
    "book_comments";

INSERT INTO "user"("username", "password", "email")
VALUES
    (
        'demo',
        -- password = 'pass,
        '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
        'demo@email.com'
    ),
    (
        'admin',
        -- password = 'pass,
        '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
        'admin@email.com'
    );

INSERT INTO "category"("media_type", "media_name")
VALUES 
    ('movies', 'Movies'),
    ('tv_shows', 'TV Shows'),
    ('podcasts', 'Podcasts'),
    ('books', 'Books');

INSERT INTO "movies"("title", "event_description", "date_created", "media_id", "media_runtime", "release_date", "genre", "imdb_rating", "mpaa_rating", "poster", "movie_id")
VALUES
    ('Lord of the Rings', 'LotR is a fantasy movie about a fellowship trying to stop the dark forces of Sauron', '2019-09-09', 1, 178, '2001-12-19', 'Fantasy', 8.8, 'PG-13', 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg', 120),
    ('Inception', 'Prepare to have your mind incepted', '2017-03-09', 1, 148, '2010-07-16', 'Action', 8.8, 'PG-13', 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 27205),
    ('Goodfellas', 'A gangster movie', '1960-09-09', 1, 146, '1990-09-21', 'Drama', 8.7, 'R', 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 769),
    ('Frozen', 'Let it goooooo', '2010-02-10', 1, 102, '2013-11-27', 'Animation', 7.5, 'PG', 'https://m.media-amazon.com/images/M/MV5BMTQ1MjQwMTE5OF5BMl5BanBnXkFtZTgwNjk3MTcyMDE@._V1_SX300.jpg', 109445);

INSERT INTO "tv_shows"("title", "event_description", "date_created", "media_id", "media_runtime")
VALUES
    ('Game of Thrones', 'People fighting over a chair', '2019-05-19', 2, '45 min'),
    ('The Boys', 'A group of lads try to take down corrupt superheroes', '2018-02-12', 2, '45 min'),
    ('Stranger Things', 'A group of young lads investigate mysterious happenings in the town of Hawkins, Indiana', '2018-12-12', 2, '45 min'),
    ('Avatar: The Last Airbender', 'A group of young lads embark on an adventure to save the world from the Fire Nation', '2019-07-10', 2, '45 min');

INSERT INTO "podcasts"("title", "event_description", "date_created", "media_id",  "media_runtime")
VALUES
    ('Crime Junkie', 'Podcast about crime', '2019-03-29', 3, '60 min'),
    ('The Joe Rogan Experience', 'Joe Rogan being Joe Rogan', '2018-09-12', 3, '60 min'),
    ('This Land', 'Podcast about history???', '2018-10-11', 3, '60 min'),
    ('Serial', 'Podcast about serial killers', '2019-11-08', 3, '60 min');

INSERT INTO "books"("title", "event_description", "date_created", "media_id",  "media_runtime")
VALUES
    ('Where the Red Fern Grows', 'A sad book with dogs', '2019-04-21', 4, '30 min'),
    ('Born a Crime', 'Trevor Noah autobiography', '2018-05-22', 4, '30 min'),
    ('Harry Potter and the Chamber of Secrets', 'Second Harry Potter book', '2017-09-19', 4, '30 min'),
    ('The Very Hungry Caterpillar', 'He is hungry', '2019-12-02', 4, '30 min');

INSERT INTO "movie_comments"("user_comment", "user_name", "date_created", "media_id", "comment_timestamp")
VALUES
    ('test comment 1', 'demo', '2019-09-09 01:30:59', 1, 720),
    ('another test comment', 'admin', '2017-03-09 11:30:59', 1, 2000),
    ('hello from EJ', 'demo', '1960-09-09 20:40:59', 3, 1000),
    ('random comment', 'admin', '2010-02-10 10:30:59', 4, 1200);

INSERT INTO "tv_show_comments"("user_comment", "user_name", "date_created", "media_id", "comment_timestamp")
VALUES
    ('test comment 1', 'demo', '2019-09-09 01:30:59', 1, 500),
    ('another test comment', 'admin', '2017-03-09 11:30:59', 2, 750),
    ('hello from EJ', 'demo', '1960-09-09 20:40:59', 2, 1000),
    ('random comment', 'admin', '2010-02-10 10:30:59', 4, 2500);

INSERT INTO "podcast_comments"("user_comment", "user_name", "date_created", "media_id", "comment_timestamp")
VALUES
    ('test comment 1', 'demo', '2019-09-09 01:30:59', 1, 600),
    ('another test comment', 'admin', '2017-03-09 11:30:59', 1, 1700),
    ('hello from EJ', 'demo', '1960-09-09 20:40:59', 3, 2800),
    ('random comment', 'admin', '2010-02-10 10:30:59', 4, 3500);

INSERT INTO "book_comments"("user_comment", "user_name", "date_created", "media_id", "comment_timestamp")
VALUES
    ('test comment 1', 'demo', '2019-09-09 01:30:59', 1, 200),
    ('another test comment', 'admin', '2017-03-09 11:30:59', 1, 800),
    ('hello from EJ', 'demo', '1960-09-09 20:40:59', 3, 1000),
    ('random comment', 'admin', '2010-02-10 10:30:59', 4, 1600);

INSERT INTO "happening"("media_type", "media_title", "username", "user_comment", "media_title_comments", "date_created", "media_id")
VALUES
    ('movies', 'Frozen', null, null, null, '2019-05-04 02:20:19', 1),
    ('movies', null, 'admin', 'another comment from admin', 'Frozen', '1960-09-09 20:40:59', 1);

COMMIT;
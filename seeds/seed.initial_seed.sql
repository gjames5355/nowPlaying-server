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
    "book_comments",
    "happening";

INSERT INTO "user"("username", "password", "email")
VALUES
    (
        'demo',
        -- password = 'Password!1',
        '$2y$12$pPiSpsQn2PMkAyvw75001.A6vdh0Ki2wlbukD0j2txbDg4TnVmHky',
        'demo@email.com'
    ),
    (
        'admin',
        -- password = 'Password!1',
        '$2y$12$pPiSpsQn2PMkAyvw75001.A6vdh0Ki2wlbukD0j2txbDg4TnVmHky',
        'admin@email.com'
    );

INSERT INTO "category"("media_type", "media_name")
VALUES 
    ('movies', 'Movies'),
    ('tv_shows', 'TV Shows'),
    ('podcasts', 'Podcasts'),
    ('books', 'Books');

COMMIT;
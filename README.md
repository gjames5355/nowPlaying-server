# Now Playing API

- Live link to API endpoints: https://murmuring-lowlands-61113.herokuapp.com/api
- Live link to application: https://whatsplaying.now.sh/

- Link to Server Repo: https://github.com/gjames5355/nowPlaying-server
- Link to Client Repo: https://github.com/gjames5355/nowPlaying-client

![HomePage](/homepage.png)

## Getting Started

- Clone the repository and install dependencies using `npm install`
- Create local PostgreSQL databases:
  - `nowplaying`
  - `nowplaying-test`
- Create a `.env` file and provide the local database locations
  - Example: `"postgresql://dunder_mifflin@localhost/tv-tracker"`
- Update the databases using `npm run migrate` and `npm run migrate:test`
- Seed the database with dummy data using `psql -U [username] -d nowplaying -f ./seeds/seed.initial_seed.sql`
- Run the local server using `npm run dev`

## Description

Now Playing API is the server responsible for handling API requests for the Now Playing application

## Endpoints

#### Protected Endpoints

##### Main Endpoints (Protected)

- `POST /api/main/:thread` : Endpoint for user to create a new thread, which is saved in the database. Returns an object with the thread's properties. Most fields are obtained from the TMDb database. Field options include:
  - title (required): Name of thread (movie)
  - event_description: Description of the thread (movie)
  - date_created (required): Date that the thread was created
  - media_runtime (required): Integer value of thread's (movie) length in minutes
  - release_date: String value of when the movie was released
  - genre: Genre of the thread (movie)
  - imdb_rating: Rating of the movie
  - mpaa_rating: MPAA rating of the movie
  - poster: Poster URL of the thread (movie)
  - backdrop: Backdrop image URL of the thread (movie)
  - movie_id: Movie ID provided by TMDb API service
  - media_id: ID of the thread's media type
  - video_key: YouTube trailer URL of the thread (movie)

##### Happening Endpoints (Protected)

- `POST /api/happening` : Endpoint that creates new event in the application's "What's Happening" activity feed. A new event is created if a user creates a new thread OR adds a new comment in a thread. Field options include:
  - media_type (required): Media type of the thread (movies, tv_shows, podcasts, books)
  - media_title: Title of the thread, if POSTing when a user creates a new thread
  - username: User's username
  - user_comment: User's comment
  - media_title_comments: Title of the thread, if POSTing when a user adds a new comment in a thread
  - date_created (required): Timestamp of when the thread or comment was created
  - media_id: ID of the movie in our "movies" table

##### Comments Endpoints (Protected)

- `POST /api/comments/:comment_thread` : Endpoint that inserts a new comment into the database. Field options include:
  - user_comment (required): User's comment
  - user_name (required): User's username
  - date_created (required): Timestamp of when the comment was created
  - media_id: ID of movie in the "movies" table
  - comment_timestamp: Integer value (in seconds) of when the comment was created in a thread, in relation to the thread (movie) runtime

#### Unprotected Endpoints

##### Main Endpoints (Unprotected)

- `GET /api/main` : Returns an array of all the media type categories:

  - movies
  - tv_shows
  - podcasts
  - books

- `GET /api/main/:thread` : Returns an array of all the media entries according to the media type / category

- `GET /api/main/:thread/:id` : Returns an array of a specific media entry according to the media type / category

- `GET /api/main/:thread/:id/movie_comments` : Returns an array of comments for a specific movie entry according to the media type / category

- `GET /api/main/:thread/:id/tv_show_comments` : Returns an array of comments for a specific TV show entry according to the media type / category (Stretch feature)

- `GET /api/main/:thread/:id/podcast_comments` : Returns an array of comments for a specific podcast entry according to the media type / category (Stretch feature)

- `GET /api/main/:thread/:id/book_comments` : Returns an array of comments for a specific book entry according to the media type / category (Stretch feature)

##### Happening Endpoints (Unprotected)

- `GET /api/happening` : Returns an array of the first 5 & newest event entries in the "happening" table

- `DELETE /api/happening/:id` : Deletes a happening event from the database

#### User Endpoint

- `POST /api/user` : Endpoint for user to register and create their own account for the application. Credentials are stored in the "user" table in the database. Field options include:
  - email (required): User's email address
  - username (required): User's desired username
  - password (required): User's desired password

#### Auth Endpoint

- `POST /api/auth/token` : Endpoint used to validate a user's username and password. Returns a JWT token to authorize additional requests to the API upon successful login. Field options include:
  - username (required): User's username
  - password (required): User's password

## Technologies

- NodeJS
- Express
- PostgreSQL

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Popcorn Palace Movie Ticket Booking System

## Overview
The Popcorn Palace Movie Ticket Booking System is a backend service designed to handle various operations related to movie, showtime, and booking management.

I am pleased to confirm that the Popcorn Palace Movie Booking System is now feature-complete and ready for review.

The system was built with a focus on data integrity and concurrency, ensuring a seamless experience even during high-traffic booking periods. Below is a summary of the core technical milestones achieved:

Key Technical Features:

Atomic Booking Transactions: Implemented PostgreSQL-level pessimistic locking and TypeORM transactions to ensure that no seat can be double-booked, even if two users click "Purchase" at the exact same millisecond.

Data Preservation (Soft Deletes): Utilized a soft-delete strategy for movie management. This ensures that while movies can be removed from the public catalog, historical financial records and past booking data remain intact for accounting purposes.

Graceful Error Handling & CORS: Configured a robust global validation pipe and CORS policy, providing clear, actionable feedback to the frontend and securing cross-origin communication.

Relational Integrity: Structured a complex database schema with cascading rules that protect the system from orphaned showtimes or broken booking links.

Testing & Quality Assurance:

Developed a comprehensive E2E (End-to-End) Test Suite covering the full user journey: from movie creation and showtime scheduling to successful seat selection and validation.

Verified system behavior against edge cases, including missing fields, overlapping showtimes, and invalid seat numbers.

## Functionality
The system provides the following APIs:

- **Movie API**: Manages movies available on the platform.
- **Showtime API**: Manages movies showtime on the theaters.
- **Booking API**: Manages the movie tickets booking.

## APIs

### Movies  APIs

| API Description           | Endpoint               | Request Body                          | Response Status | Response Body |
|---------------------------|------------------------|---------------------------------------|-----------------|---------------|
| Get all movies | GET /movies/all | | 200 OK | [ { "id": 12345, "title": "Sample Movie Title 1", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }, { "id": 67890, "title": "Sample Movie Title 2", "genre": "Comedy", "duration": 90, "rating": 7.5, "releaseYear": 2024 } ] |
| Add a movie | POST /movies | { "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 } | 200 OK | { "id": 1, "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }|
| Update a movie | POST /movies/update/{movieTitle} | { "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 } | 200 OK | |
| DELETE /movies/{movieTitle} | | 200 OK | |

### Showtimes APIs

| API Description            | Endpoint                           | Request Body                                                                                                                                      | Response Status | Response Body                                                                                                                                                                                                                                                                   |
|----------------------------|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Get showtime by ID | GET /showtimes/{showtimeId} |                                                                                                                                                   | 200 OK | { "id": 1, "price":50.2, "movieId": 1, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" }                                                                                                                      | | Delete a restaurant        | DELETE /restaurants/{id}           |                                                                              | 204 No Content  |                                                                                                        |
| Add a showtime | POST /showtimes | { "movieId": 1, "price":20.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } | 200 OK | { "id": 1, "price":50.2,"movieId": 1, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" }                                                                                                                                    |
| Update a showtime | POST /showtimes/update/{showtimeId}| { "movieId": 1, "price":50.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } | 200 OK |                                                                                                                                                                                                                                                                                 |
| Delete a showtime | DELETE /showtimes/{showtimeId} |                                                                                                                                                   | 200 OK |                                                                                                                                                                                                                                                                                 |




### bookings APIs

| API Description           | Endpoint       | Request Body                                     | Response Status | Response Body                                                                                                                                          |
|---------------------------|----------------|--------------------------------------------------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| Book a ticket | POST /bookings | { "showtimeId": 1, "seatNumber": 15 , userId:"84438967-f68f-4fa0-b620-0f08217e76af"} | 200 OK | { "bookingId":"d1a6423b-4469-4b00-8c5f-e3cfc42eacae" }                                                                                                 |



## Installation

```bash
$ npm install
```

## Database Services (Docker Compose)

Ensure Docker Desktop (or any Docker host) is running, then start the PostgreSQL service defined in compose.yml:

```bash
$ docker compose up -d db
```

This brings up the `db` service on port 5432 with the `popcorn-palace` credentials declared in compose.yml. To stop the container, run `docker compose down` (or `docker compose stop db` to only halt the database).

## Running the app

```bash
# server development
$ npm run start

# frontend development
$ npm run start:dev
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## License

Nest is [MIT licensed](LICENSE).

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

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

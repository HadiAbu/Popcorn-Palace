# Popcorn Palace TypeScript Backend

The Popcorn Palace Movie Ticket Booking System is a backend service designed to handle various operations related to movie, showtime, and booking management.

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- PostgreSQL (if using the database locally)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd popcorn_palace_typescript
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory and configure the necessary environment variables. For example:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=popcorn-palace
   DATABASE_PASSWORD=popcorn-palace
   DATABASE_NAME=popcorn_palace
   ```

2. Ensure your PostgreSQL database is running and matches the configuration in the `.env` file.

## Running the Application

### Docker setup

To run a local PostgreSQL instance using Docker.

```bash
docker-compose up
```

### Development Mode

To start the application in development mode with hot-reloading:

```bash
npm run start:dev
```

### Production Mode

To build and start the application in production mode:

```bash
npm run build
npm run start:prod
```

### Debug Mode

To start the application in debug mode:

```bash
npm run start:debug
```

## Testing

### Unit Tests

Run unit tests:

```bash
npm test
```

### End-to-End Tests

Run end-to-end tests:

```bash
npm run test:e2e
```

## Linting and Formatting

### Linting

Run the linter and automatically fix issues:

```bash
npm run lint
```

### Formatting

Format the codebase:

```bash
npm run format
```

## Project Structure

- **src/**: Contains the main application code.
  - **bookings/**: Handles booking-related operations.
  - **movies/**: Handles movie-related operations.
  - **showtimes/**: Handles showtime-related operations.
  - **middleware/**: Contains middleware such as exception filters.
- **test/**: Contains test files for unit and end-to-end testing.

## Additional Notes

- This project uses TypeORM for database interactions.
- Swagger documentation can be added for API endpoints using the `@nestjs/swagger` package.
- Ensure to update the `.env` file with the correct database credentials before running the application.

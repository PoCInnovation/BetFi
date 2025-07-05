# BetFi NestJS API

A NestJS API backend for the BetFi application.

## Description

This is a [NestJS](https://github.com/nestjs/nest) framework TypeScript starter repository for building scalable Node.js server-side applications.

## Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

## Running the app

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## Test

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Endpoints

- `GET /api` - Hello message
- `GET /api/health` - Health check endpoint

## Development

The API runs on `http://localhost:3000` by default. All endpoints are prefixed with `/api`.

## Project Structure

```
src/
├── app.controller.ts    # Main controller
├── app.module.ts        # Root module
├── app.service.ts       # Main service
└── main.ts             # Application entry point
```

## License

This project is [MIT licensed](LICENSE).

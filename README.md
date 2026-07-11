# TicketFlow

A full-stack event ticketing platform. Organizers create events and check in attendees via QR code; attendees browse events, purchase tickets, and store them in a digital wallet.

This project was built as a capstone project, with a deliberate focus on demonstrating production-oriented backend architecture: relational and non-relational data modeling, asynchronous processing, authentication, and containerized infrastructure.

## Tech stack

| Layer | Technology |
|---|---|
| Mobile | React Native, Expo, Expo Router, TanStack Query |
| API | NestJS, TypeScript |
| Relational database | PostgreSQL + Prisma ORM |
| Non-relational database | MongoDB |
| Message queue | RabbitMQ |
| Authentication | JWT (Passport) + bcrypt |
| Payments | Stripe (test mode) with webhook confirmation |
| Infrastructure | Docker + Docker Compose |
| API documentation | Swagger / OpenAPI |

## Features

- [x] Event CRUD with ownership-based authorization
- [x] User registration and login with hashed passwords
- [x] JWT authentication with route guards
- [ ] Asynchronous ticket generation via RabbitMQ (in progress)
- [ ] Payment webhook integration
- [ ] Mobile app (event listing, purchase flow, digital ticket wallet)
- [ ] QR code check-in flow
- [ ] Cloud deployment

## Architecture

The API is the single entry point for the mobile app. It owns all communication with the relational database, the document store, the message queue, and file storage. Payment confirmation arrives asynchronously via webhook and is published to a queue, decoupling ticket generation from the request/response cycle.

## Getting started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) 18 or later
- [Nest CLI](https://docs.nestjs.com/cli/overview): `npm install -g @nestjs/cli`

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ticketflow.git
cd ticketflow
```

### 2. Start the infrastructure

```bash
cp .env.example .env
docker compose up -d
docker compose ps
```

This starts PostgreSQL, MongoDB, and RabbitMQ (management UI available at `http://localhost:15672`).

### 3. Set up the backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

The API runs at `http://localhost:3000`. Interactive API documentation is available at `http://localhost:3000/docs`.

## Project structure

```
ticketflow/
├── docker-compose.yml       # local infrastructure (Postgres, Mongo, RabbitMQ)
├── .env                     # infrastructure credentials
└── backend/
    ├── prisma/
    │   └── schema.prisma    # data model
    └── src/
        ├── prisma/          # global Prisma service/module
        ├── users/           # user creation and lookup
        ├── auth/            # registration, login, JWT strategy and guards
        └── events/          # event CRUD with ownership authorization
```

## Key technical decisions

- **Prisma 6 over Prisma 7**: at the time of development, Prisma 7 had recently changed its datasource configuration (moving connection URLs to a separate `prisma.config.ts` and requiring driver adapters). Given the limited scope and time budget of this project, Prisma 6 was chosen for its stability and broader documentation coverage.
- **`Ticket` is optional on `Order`**: this models the asynchronous reality of the system — an order starts as `PENDING` and only gets a `Ticket` once a worker processes the payment confirmation from the queue.
- **Ownership-based authorization**: rather than relying solely on authentication (is this user logged in?), write operations on events also check authorization (does this user own this specific event?), returning `403 Forbidden` when they don't.

## Future work

Terraform for infrastructure as code, end-to-end testing with Detox, real-time ticket sales counter via WebSocket, social login, and a separate web admin dashboard were considered but deliberately left out of scope to keep the project achievable within the available timeframe.

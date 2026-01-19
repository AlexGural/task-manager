# Task Manager API

REST API for task and user management.

## Quick Start

```bash
# 1. Create .env file
cp .env.example .env

# 2. Start
make up
```

API: http://localhost:3000  
Swagger: http://localhost:3000/api/doc

## Commands

```bash
make up        # Start containers
make build     # Rebuild and start
make down      # Stop containers
make restart   # Restart containers
make logs      # Show logs
make clean     # Remove containers and volumes

make test      # Run unit tests
make test-e2e  # Run e2e tests
make test-all  # Run all tests

make seed-dev  # Seed demo data
```

## Architecture

I chose **Hexagonal Architecture** for this project. 
This decision was influenced by the fact that hexagonal architecture is already used in the ayunis core, 
and since I mainly worked with Onion Architecture before, 
I was curious to try this approach myself. 
I really liked the modularity and clear separation of layers.

### Project Structure

```
src/
├── config/                    # App configuration & env validation
├── data-source/               # Migrations, factories, seeders
├── domain/
│   ├── common/
│   │   └── exceptions/        # Domain exceptions
│   ├── tasks/
│   │   ├── application/       # Use cases, commands, ports
│   │   ├── domain/            # Entities, value objects
│   │   ├── infrastructure/    # Repository implementations, ORM
│   │   └── presenters/        # HTTP controllers, DTOs
│   └── users/
│       └── ...                # Same structure
└── infrastructure/            # Global filters, guards, swagger
```

### Key Decisions

- **Use Cases** — Each business operation is a separate use case class, making the code testable and following Single Responsibility Principle
- **Ports & Adapters** — Domain layer defines abstract repository ports; infrastructure provides implementations
- **Domain Exceptions** — Custom exceptions (`EntityNotFoundException`, `EntityAlreadyExistsException`) keep the domain layer independent from HTTP/NestJS
- **TypeORM Records** — ORM entities are named `*Record` to distinguish them from domain entities
- **Migrations only** — Schema changes via migrations in all environments (`synchronize: false`)
- **Map + Type pattern** — Instead of enums, using `const map` + `type` for better type safety and tree-shaking

## Tech Stack

- **NestJS + Fastify** — Fast, extensible Node.js framework
- **PostgreSQL + TypeORM** — Reliable database with powerful ORM
- **Docker Compose** — Easy local development and testing
- **Jest** — Unit and e2e testing

## Assumptions

- Users are created without authentication (simplified for demo)
- API requires `x-token-id` header (simple guard, no real auth)
- Many-to-many relationship between tasks and users (assignees)
- Task statuses: `todo`, `in_progress`, `done`

## API Endpoints

### Tasks
- `GET /tasks` — List all tasks
- `POST /tasks` — Create task
- `GET /tasks/:id` — Get task by ID
- `PATCH /tasks/:id` — Update task
- `DELETE /tasks/:id` — Delete task
- `POST /tasks/:id/assignees` — Assign user to task
- `DELETE /tasks/:id/assignees/:userId` — Unassign user
- `GET /tasks/:id/assignees` — Get task assignees

### Users
- `POST /users` — Create user
- `DELETE /users/:id` — Delete user

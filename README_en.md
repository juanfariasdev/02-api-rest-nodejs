<!-- English -->

[Clique aqui para ler o README em português (Brasil)](README.md)

# Project: 02-api-rest-nodejs

**Track:** NodeJS 2023

API developed during the classes at [Rocketseat](https://www.rocketseat.com.br)

## Technologies Used

- Typescript
- NodeJS

## Libraries

- Fastify
- Knex
- Zod
- Dotenv

## Testing

- Vitest
- Supertest

## Database

- SQlite3
- Postgres

## Summary

The "02-api-rest-nodejs" project aims to develop a REST API using Fastify, Typescript, and other mentioned tools.

## Functional Requirements

- [x] Allow users to create a new transaction.
- [x] Allow users to delete a transaction.
- [x] Allow users to get an account summary.
- [x] Allow users to list all transactions that have occurred.
- [x] Allow users to view a specific transaction.

## Non-Functional Requirements

- [x] Transactions can be classified as credit (adding to the total value) or debit (subtracting from the total value).
- [x] User identification must be maintained between requests.
- [x] Users can only view transactions they have created.

## Installation and Execution

Follow the instructions below to install and run the project:

1. Run the command `npm install` to install the dependencies.
2. Run the command `npm run build` to compile the project.
3. Run the command `npm run knex -- migrate:latest` to execute the database migrations.

To start the project in development mode, run the command `npm run dev` after installing the dependencies.

## Routes

- `GET /session`:

  - Creates a session and saves it in a cookie.

- `GET /transactions`:

  - Lists all transactions according to the user.

- `GET /transactions/ID`:

  - Lists a specific transaction according to the ID.

- `GET /transactions/summary`:

  - Shows a summary of the account values, including TOTAL, CREDIT, and DEBIT.

- `DELETE /transactions/ID`:

  - Deletes a specific transaction according to the ID.

- `POST /transactions`:
  - Adds a new transaction.
  - Accepts the following data format:
  ```json
  {
    "title": "This is a title", // Place the title here
    "amount": 1200, // Value
    "type": "credit" // Transaction type: "credit" or "debit"
  }
  ```

# Projeto: 02-api-rest-nodejs

**Trilha:** NodeJS 2023

Feito pela [Rocketseat](https://www.rocketseat.com.br)

## Tecnologias Utilizadas

- Typescript
- NodeJS

## Bibliotecas

- Fastify
- Knex
- Zod
- Dotenv

## Testes

- Vitest
- Supertest

## Banco de Dados

- SQlite3
- Postgres

## Resumo

O projeto "02-api-rest-nodejs" tem como objetivo desenvolver uma API REST utilizando Fastify, Typescript e outras ferramentas mencionadas.

## Requisitos Funcionais

- [x] Permitir ao usuário criar uma nova transação.
- [x] Permitir ao usuário deletar uma transação.
- [x] Permitir ao usuário obter um resumo da sua conta.
- [x] Permitir ao usuário listar todas as transações ocorridas.
- [x] Permitir ao usuário visualizar uma transação específica.

## Requisitos Não Funcionais

- [x] As transações devem ser classificadas como crédito (adicionar ao valor total) ou débito (subtrair do valor total).
- [x] Identificação do usuário deve ser mantida entre as requisições.
- [x] O usuário só pode visualizar as transações que ele criou.

## Rotas

- `GET /session`:

  - Cria uma sessão e salva no cookie.

- `GET /transactions`:

  - Lista todas as transações de acordo com o usuário.

- `GET /transactions/ID`:

  - Lista uma transação específica de acordo com o ID.

- `GET /transactions/summary`:

  - Mostra um resumo dos valores da conta, incluindo o TOTAL, CRÉDITO e DÉBITO.

- `DELETE /transactions/ID`:

  - Deleta uma transação específica de acordo com o ID.

- `POST /transactions`:
  - Adiciona uma nova transação.
  - Aceita o seguinte formato de dados:
  ```json
  {
    "title": "Isso é um título", // Coloque o título aqui
    "amount": 1200, // Valor
    "type": "credit" // Tipo da transação: "credit" ou "debit"
  }
  ```

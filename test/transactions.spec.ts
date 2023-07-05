import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "child_process";
import request, { Response } from "supertest";
import { app } from "../src/app";

// Configuração do ambiente de teste
beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  // Desfaz todas as migrações anteriores e aplica as migrações mais recentes antes de cada teste
  execSync("npm run knex migrate:rollback --all");
  execSync("npm run knex migrate:latest");
});

// Bloco de testes para as rotas de sessão
describe("Session routes", () => {
  it("should be able to create a new session", async () => {
    const createSessionResponse = await request(app.server)
      .get("/session")
      .expect(201);

    const cookie = createSessionResponse.header["set-cookie"];

    await request(app.server).get("/session").set("Cookie", cookie).expect(200);
  });
});

// Bloco de testes para as rotas de transações
describe("Transactions routes", () => {
  let cookie: string;

  beforeEach(async () => {
    const createSessionResponse = await request(app.server).get("/session");
    cookie = createSessionResponse.header["set-cookie"];
  });

  it("should be able to verify transaction summary", async () => {
    // Criar transações de exemplo
    const transactions = [
      { title: "Transaction summary Credit", amount: 1203, type: "credit" },
      { title: "Transaction summary Credit", amount: 202, type: "credit" },
      { title: "New transaction Test", amount: 760, type: "debit" },
      { title: "New transaction Test", amount: 760, type: "debit" },
    ];

    // Enviar as transações e verificar o resumo das transações
    for (const transaction of transactions) {
      await request(app.server)
        .post("/transactions")
        .send(transaction)
        .set("Cookie", cookie)
        .expect(201);
    }

    const summaryResponse: Response = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookie);

    const { credit, debit, amount } = summaryResponse.body.summary;

    expect(credit).toEqual(1405);
    expect(debit).toEqual(1520);
    expect(amount).toEqual(-115);
  });

  it("should be able to create a new transaction", async () => {
    const transaction = {
      title: "New transaction Test",
      amount: 500,
      type: "credit",
    };

    await request(app.server)
      .post("/transactions")
      .send(transaction)
      .set("Cookie", cookie)
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const transaction = {
      title: "New transaction Test",
      amount: 600,
      type: "credit",
    };

    await request(app.server)
      .post("/transactions")
      .send(transaction)
      .set("Cookie", cookie)
      .expect(201);

    const listTransactionResponse: Response = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookie)
      .expect(200);

    const { transactions } = listTransactionResponse.body;

    expect(transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "New transaction Test",
          amount: 600,
        }),
      ])
    );
  });

  it("should be able to get details of a transaction", async () => {
    const transaction = {
      title: "New transaction Test",
      amount: 600,
      type: "credit",
    };

    await request(app.server)
      .post("/transactions")
      .send(transaction)
      .set("Cookie", cookie);

    const listAllTransactionResponse: Response = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookie);

    const transactionId = listAllTransactionResponse.body.transactions[0].id;

    const getTransactionResponse: Response = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "New transaction Test",
        amount: 600,
      })
    );
  });

  it("should be able to delete a transaction", async () => {
    const transaction = {
      title: "New transaction Test",
      amount: 600,
      type: "credit",
    };

    await request(app.server)
      .post("/transactions")
      .send(transaction)
      .set("Cookie", cookie);

    const listAllTransactionResponse: Response = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookie);

    const transactionId = listAllTransactionResponse.body.transactions[0].id;

    await request(app.server)
      .delete(`/transactions/${transactionId}`)
      .set("Cookie", cookie)
      .expect(201);
  });
});

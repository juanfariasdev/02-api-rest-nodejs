import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // beforeEach(() => {
  //   execSync("npm run knex migrate:rollback --all");
  //   execSync("npm run knex migrate:latest");
  // });

  describe("Session", async () => {
    it("should be able get a new session", async () => {
      const createSession = await request(app.server)
        .get("/session")
        .expect(201);

      const cookie = createSession.get("set-cookie");

      await request(app.server)
        .get("/session")
        .set("Cookie", cookie)
        .expect(200);
    });
  });
  describe("Transactions", async () => {
    it("should be able to verify summary", async () => {
      const createSession = await request(app.server).get("/session");
      const cookie = createSession.get("set-cookie");

      await request(app.server)
        .post("/transactions")
        .send({
          title: "Transaction summary Credit",
          amount: 1203,
          type: "credit",
        })
        .set("Cookie", cookie)
        .expect(201);

      await request(app.server)
        .post("/transactions")
        .send({
          title: "Transaction summary Credit",
          amount: 202,
          type: "credit",
        })
        .set("Cookie", cookie)
        .expect(201);

      await request(app.server)
        .post("/transactions")
        .send({
          title: "New transaction Test",
          amount: 760,
          type: "debit",
        })
        .set("Cookie", cookie)
        .expect(201);

      await request(app.server)
        .post("/transactions")
        .send({
          title: "New transaction Test",
          amount: 760,
          type: "debit",
        })
        .set("Cookie", cookie)
        .expect(201);

      const getSummaryTransaction = await request(app.server)
        .get("/transactions/summary")
        .set("Cookie", cookie);

      expect(getSummaryTransaction.body.summary.credit).toEqual(1405);
      expect(getSummaryTransaction.body.summary.debit).toEqual(1520);
      expect(getSummaryTransaction.body.summary.amount).toEqual(-115);
    });

    it("should be able to create a new transaction", async () => {
      const createSession = await request(app.server).get("/session");

      const cookie = createSession.get("set-cookie");

      await request(app.server)
        .post("/transactions")
        .send({
          title: "New transaction Test",
          amount: 500,
          type: "credit",
        })
        .set("Cookie", cookie)
        .expect(201);
    });

    it("should be able to list all transactions", async () => {
      const createSession = await request(app.server).get("/session");

      const cookie = createSession.get("set-cookie");

      await request(app.server)
        .post("/transactions")
        .send({
          title: "New transaction Test",
          amount: 600,
          type: "credit",
        })
        .set("Cookie", cookie)
        .expect(201);

      const listTransactionResponse = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookie)
        .expect(200);

      expect(listTransactionResponse.body.transactions).toEqual([
        expect.objectContaining({
          title: "New transaction Test",
          amount: 600,
        }),
      ]);
    });

    it("should be able to list one transaction", async () => {
      const createSession = await request(app.server).get("/session");
      const cookie = createSession.get("Set-Cookie");

      await request(app.server)
        .post("/transactions")
        .send({
          title: "New transaction Test",
          amount: 600,
          type: "credit",
        })
        .set("Cookie", cookie);

      const listAllTransactionResponse = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookie);

      const transactionId = listAllTransactionResponse.body.transactions[0].id;

      const getTransactionResponse = await request(app.server)
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
      const createSession = await request(app.server).get("/session");
      const cookie = createSession.get("Set-Cookie");

      await request(app.server)
        .post("/transactions")
        .send({
          title: "New transaction Test",
          amount: 600,
          type: "credit",
        })
        .set("Cookie", cookie);

      const listAllTransactionResponse = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookie);

      const transactionId = listAllTransactionResponse.body.transactions[0].id;

      await request(app.server)
        .delete(`/transactions/${transactionId}`)
        .set("Cookie", cookie)
        .expect(201);
    });
  });
});

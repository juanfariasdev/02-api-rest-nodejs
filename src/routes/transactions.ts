import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";

import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      let { sessionId } = request.cookies;

      const transactions = await knex("transactions")
        .select()
        .where("session_id", sessionId);

      return { transactions };
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({ id: z.string().uuid() });
      const { id } = getTransactionParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      const transaction = await knex("transactions")
        .select("*")
        .where({ id, session_id: sessionId })
        .first();

      return { transaction };
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const credit = await knex("transactions")
        .sum("amount", { as: "credit" })
        .where("amount", ">", 0)
        .andWhere("session_id", sessionId)
        .first()
        .then((value) => Number(value?.credit));

      const debit = await knex("transactions")
        .sum("amount", { as: "debit" })
        .where("amount", "<", 0)
        .andWhere("session_id", sessionId)
        .first()
        .then((value) => Number(value?.debit));

      const summary = {
        amount: credit + debit,
        credit,
        debit: debit * -1,
      };

      return { summary };
    }
  );

  app.delete(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, response) => {
      const getTransactionParamsSchema = z.object({ id: z.string().uuid() });
      const { id } = getTransactionParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      const item = await knex("transactions")
        .select()
        .where({ id, session_id: sessionId })
        .first();

      if (!item?.id) response.status(400).send("item not found");

      await knex("transactions").delete().where({ id, session_id: sessionId });

      response.status(201).send("Deleted transaction");
    }
  );

  app.post(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, response) => {
      const createTransactionBodySchema = z.object({
        title: z.string().min(3, "The title needs at least 3 characters"),
        amount: z.number(),
        type: z.enum(["credit", "debit"]),
      });

      let { sessionId } = request.cookies;

      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body
      );

      await knex("transactions").insert({
        id: randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        session_id: sessionId,
      });

      response.status(201).send("Created transaction");
    }
  );
}

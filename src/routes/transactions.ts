import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function transactionsRoutes(app: FastifyInstance) {
  app.post("/", async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string().min(3, "The title needs at least 3 characters"),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    response.status(201).send("Created transaction");
  });
}

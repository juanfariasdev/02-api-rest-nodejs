import fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";
import { randomUUID } from "node:crypto";

export const app = fastify();

app.register(cookie);

app.get("/session", async (request, response) => {
  let { sessionId } = request.cookies;

  if (!sessionId) {
    sessionId = randomUUID();
    response.cookie("sessionId", sessionId, {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    response.status(201).send({ msg: "Session created" });
  }

  response.status(200).send({ msg: "Session exist" });
});

app.register(transactionsRoutes, {
  prefix: "/transactions",
});

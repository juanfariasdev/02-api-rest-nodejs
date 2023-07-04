import fastify from "fastify";
import fs from "node:fs";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";
import { randomUUID } from "node:crypto";

const app = fastify();

const folderTmp = "./db";
if (!fs.existsSync(folderTmp)) {
  fs.mkdirSync(folderTmp);
}

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

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP Server Running...");
  });

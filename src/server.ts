import fastify from "fastify";
import fs from "node:fs";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

const folderTmp = "./db";
if (!fs.existsSync(folderTmp)) {
  fs.mkdirSync(folderTmp);
}

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

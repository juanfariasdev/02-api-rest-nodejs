import fastify from "fastify";
import { knex } from "./database";
import fs from "node:fs";

const app = fastify();

const folderTmp = "./db";

if (!fs.existsSync(folderTmp)) {
  fs.mkdirSync(folderTmp);
}

app.get("/hello", async () => {
  const test = await knex("sqlite_schema").select("*");
  return test;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP Server Running...");
  });

import { FastifyRequest, FastifyReply } from "fastify";

export async function checkSessionIdExists(
  request: FastifyRequest,
  response: FastifyReply
) {
  let { sessionId } = request.cookies;

  if (!sessionId) {
    return response.status(401).send({
      error: "Unauthorized access",
    });
  }
}

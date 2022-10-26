import Fastify, { FastifyInstance } from "fastify"
import { root } from "./root"

const server: FastifyInstance = Fastify({})

const start = async () => {
  await root(server, {})
  await server.listen({
    host: "0.0.0.0",
    port: 3000,
  })
  console.log("running on port 3000")
}

start()

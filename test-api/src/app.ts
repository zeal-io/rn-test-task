import Fastify, { FastifyInstance } from "fastify"
import { root } from "./root"

const server: FastifyInstance = Fastify({})

const start = async () => {
  await root(server, {})
  await server.listen(3000)
  console.log("running on port 3000")
}

start()

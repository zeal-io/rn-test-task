import { Admin } from "@prisma/client"
import { FastifyPluginAsync } from "fastify"
import { prisma } from "./utils"

const SEPERATOR = ";;;;....;;;;"

function getToken(admin: Admin) {
  return `${admin.email}${SEPERATOR}${admin.password}`
}

function getEmailFromToken(token: string) {
  return token.split(SEPERATOR)[0]
}

export const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<Register>("/register", async (req, res) => {
    const { email, password, name } = req.body

    if (!email || !password) {
      res.status(400).send({ error: "Missing info" })
    }

    if (password.length < 8) {
      res.status(400).send({ error: "password too short" })
    }

    if (await prisma.admin.findFirst({ where: { email } })) {
      res.status(400).send({ error: "User already exists" })
      return
    }

    const admin = await prisma.admin.create({
      data: { email, password, name },
    })

    res.send({ token: getToken(admin), admin: { email, name } })
  })

  fastify.post<Login>("/login", async (req, res) => {
    const { email, password } = req.body

    const admin = await prisma.admin.findFirst({ where: { email } })

    if (!admin || admin.password !== password) {
      return res.status(401).send({ error: "Invalid credentials" })
    }

    res.send({
      token: getToken(admin),
      admin: { email: admin.email, name: admin.name },
    })
  })

  fastify.get<GetUser>("/user", async (req, res) => {
    const { token } = req.headers

    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email }, include: { users: true } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    res.send({
      users: admin.users ?? [],
    })
  })

  fastify.post<CreateUser>("/user", async (req, res) => {
    const { token } = req.headers
    const { locations = [], ...person } = req.body

    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email }, include: { users: true } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    if (!person.email || !person.name) {
      res.status(400).send({ error: "Invalid User" })
    }

    const user = await prisma.user.create({
      data: {
        email: person.email,
        name: person.name,
        adminId: admin.id,
        locations: {
          create: locations.map(l => ({
            lat: l.lat.toString(),
            lng: l.lat.toString(),
          })),
        },
      },
      include: { locations: true },
    })

    return {
      user,
    }
  })

  fastify.patch<EditUser>("/user/:email", async (req, res) => {
    const { token } = req.headers
    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    const user = await prisma.user.update({
      where: { email: req.params.email },
      data: { email: req.body.email, name: req.body.name },
    })

    res.send({ user })
  })

  fastify.delete<DeleteUser>("/user/:email", async (req, res) => {
    const { token } = req.headers
    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    await prisma.user.delete({ where: { email: req.params.email } })

    return { ok: true }
  })

  fastify.get<GetAllLocations>("/location", async (req, res) => {
    const { token } = req.headers

    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    const locations = await prisma.location.findMany({ where: { User: { adminId: admin.id } } })

    return {
      locations: locations ?? [],
    }
  })

  fastify.post<AddLocation>("/location/:userEmail", async (req, res) => {
    const { token } = req.headers
    const { lat, lng } = req.body

    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    await prisma.user.update({
      where: { email: req.params.userEmail },
      data: {
        locations: {
          create: {
            lat: lat.toString(),
            lng: lng.toString(),
          },
        },
      },
    })

    return {}
  })

  fastify.get<GetLocations>("/location/:userEmail", async (req, res) => {
    const { token } = req.headers
    const { userEmail } = req.params

    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    const user = await prisma.user.findFirst({ where: { email: userEmail }, include: { locations: true } })

    return {
      locations: user?.locations ?? [],
    }
  })

  fastify.patch<PatchLocation>("/location/:locationId", async (req, res) => {
    const { token } = req.headers
    const { locationId } = req.params
    const { lat, lng } = req.body

    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    const location = await prisma.location.update({
      where: { id: locationId },
      data: { lat, lng },
    })

    return { location }
  })

  fastify.delete<DeleteLocation>("/location/:locationId", async (req, res) => {
    const { token } = req.headers
    const email = getEmailFromToken(token)
    const admin = await prisma.admin.findFirst({ where: { email } })

    if (!admin?.id) {
      return res.status(401).send({})
    }

    const location = await prisma.location.delete({
      where: { id: req.params.locationId },
    })

    return { location }
  })
}

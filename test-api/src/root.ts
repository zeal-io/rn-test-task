import { FastifyPluginAsync } from "fastify"
import { nanoid } from "nanoid"
import { authenticateUser, db, Location, persistDB, Person, SEPERATOR } from "./utils"

export const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{ Body: { email: string; password: string; name: string } }>("/register", async (req, res) => {
    const { email, password, name } = req.body

    if (!email || !password) {
      res.status(400).send({ error: "Missing info" })
    }

    if (db.users[email]) {
      res.status(400).send({ error: "User already exists" })
      return
    }

    if (password.includes(SEPERATOR)) {
      res.status(400).send({ error: "Invalid Password" })
      return
    }

    db.users[email] = { password, name }

    db.data[email] = {
      locations: {},
      users: {},
    }

    persistDB()

    res.send({
      token: `${email}${SEPERATOR}${password}`,
    })
  })

  fastify.post<{ Body: { email: string; password: string } }>("/login", async (req, res) => {
    const { email, password } = req.body

    console.log(email, password)
    if (!db.users[email] || db.users[email].password !== password) {
      return res.status(401).send({ error: "Invalid credentials" })
    }

    res.send({
      token: `${email}${SEPERATOR}${password}`,
    })
  })

  fastify.get<{ Headers: { token: string } }>("/user", async (req, res) => {
    const { token } = req.headers

    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      return res.status(401).send({ error: authInfo.error })
    }

    res.send({
      users: Object.values(db.data[authInfo.email!]?.users ?? {}).map(x => {
        delete x.locationsIndexes
        return x
      }),
    })
  })

  fastify.post<{ Headers: { token: string }; Body: { locations: Location[] } & Omit<Person, "locationsIndexes"> }>("/user", async (req, res) => {
    const { token } = req.headers
    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      res.status(401).send({ error: authInfo.error })
    }

    const { locations, ...person } = req.body

    if (!person.email || !person.name) {
      res.status(400).send({ error: "Invalid person" })
    }

    if (db.data[authInfo.email!].users[person.email]) {
      res.status(400).send({ error: "User already exists" })
    }

    const ids =
      locations?.reduce((acc: Record<string, true>, location) => {
        const id = nanoid()
        acc[id] = true
        db.data[authInfo.email!].locations[id] = location
        return acc
      }, {}) ?? {}

    db.data[authInfo.email!].users[person.email] = {
      ...person,
      locationsIndexes: ids,
    }

    persistDB()

    return {
      success: true,
    }
  })

  fastify.patch<{ Headers: { token: string }; Body: Omit<Person, "locationsIndexes">; Params: { email: string } }>("/user/:email", async (req, res) => {
    const { token } = req.headers
    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      res.status(401).send({ error: authInfo.error })
    }

    const { email } = req.params
    const person = req.body

    if (!db.data[authInfo.email!].users[email]) {
      res.status(400).send({ error: "No Such User" })
    }

    db.data[authInfo.email!].users[email] = {
      ...db.data[authInfo.email!].users[email],
      name: person.name || db.data[authInfo.email!].users[email].name,
      email: person.email || email,
    }

    persistDB()
    return {
      success: true,
    }
  })

  fastify.delete<{ Params: { email: string }; Headers: { token: string } }>("/user/:email", async (req, res) => {
    const { token } = req.headers
    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      res.status(401).send({ error: authInfo.error })
    }

    const { email } = req.params

    const user = db.data[authInfo.email!].users[email]

    if (!user) {
      res.status(400).send({ error: "No Such User" })
    }

    Object.keys(user.locationsIndexes).forEach(id => {
      delete db.data[authInfo.email!].locations[id]
    })

    delete db.data[authInfo.email!].users[email]

    persistDB()

    return {
      success: true,
    }
  })

  fastify.get<{ Headers: { token: string } }>("/location", async (req, res) => {
    const { token } = req.headers

    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      res.status(401).send({ error: authInfo.error })
    }

    res.send({
      locations: Object.values(db.data[authInfo.email!].locations),
    })
  })

  fastify.post<{ Headers: { token: string }; Params: { userEmail: string }; Body: { lat: number; lng: number } }>("/location/:userEmail", async (req, res) => {
    const { token } = req.headers

    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      res.status(401).send({ error: authInfo.error })
    }

    const { userEmail } = req.params
    const { lat, lng } = req.body

    const id = nanoid()

    db.data[authInfo.email!].locations[id] = { lat, lng }

    db.data[authInfo.email!].users[userEmail].locationsIndexes[id] = true

    persistDB()

    res.send({
      success: true,
    })
  })

  fastify.get<{ Headers: { token: string }; Params: { userEmail: string } }>("/location/:userEmail", async (req, res) => {
    const { token } = req.headers

    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      res.status(401).send({ error: authInfo.error })
    }

    const { userEmail } = req.params

    const ids = Object.keys(db.data[authInfo.email!].users[userEmail].locationsIndexes ?? {})

    const locations = ids.map(id => db.data[authInfo.email!].locations[id])

    res.send({
      locations: Object.values(locations),
    })
  })

  fastify.patch<{ Params: { locationId: string }; Headers: { token: string }; Body: { lat: string; lng: string } }>("/location/:locationId", async (req, res) => {
    const { token } = req.headers

    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      res.status(401).send({ error: authInfo.error })
    }

    const { locationId } = req.params
    const { lat, lng } = req.body

    if (!db.data[authInfo.email!].locations[locationId]) {
      res.status(400).send({ error: "No Such Location" })
    }

    db.data[authInfo.email!].locations[locationId] = { lat: parseFloat(lat), lng: parseFloat(lng) }

    persistDB()

    res.send({
      success: true,
    })
  })

  fastify.delete<{ Headers: { token: string }; Params: { locationId: string } }>("/location/:locationId", async (req, res) => {
    const { token } = req.headers

    const authInfo = authenticateUser(token)

    if (authInfo.error) {
      res.status(401).send({ error: authInfo.error })
    }

    const { locationId } = req.params

    if (!db.data[authInfo.email!].locations[locationId]) {
      res.status(400).send({ error: "No Such Location." })
    }

    delete db.data[authInfo.email!].locations[locationId]

    Object.keys(db.data[authInfo.email!].users).forEach(user => {
      const { locationsIndexes } = db.data[authInfo.email!].users[user]
      delete locationsIndexes[locationId]
    })

    persistDB()

    res.send({
      success: true,
    })
  })
}

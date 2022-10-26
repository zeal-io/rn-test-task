var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"), 1);

// src/utils.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/root.ts
var SEPERATOR = ";;;;....;;;;";
function getToken(admin) {
  return `${admin.email}${SEPERATOR}${admin.password}`;
}
function getEmailFromToken(token) {
  return token.split(SEPERATOR)[0];
}
var root = async (fastify) => {
  fastify.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      res.status(400).send({ error: "Missing info" });
    }
    if (password.length < 8) {
      res.status(400).send({ error: "password too short" });
    }
    if (await prisma.admin.findFirst({ where: { email } })) {
      res.status(400).send({ error: "User already exists" });
      return;
    }
    const admin = await prisma.admin.create({
      data: { email, password, name }
    });
    res.send({ token: getToken(admin) });
  });
  fastify.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await prisma.admin.findFirst({ where: { email } });
    if (!admin || admin.password !== password) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
    res.send({
      token: getToken(admin)
    });
  });
  fastify.get("/user", async (req, res) => {
    const { token } = req.headers;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email }, include: { users: true } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    res.send({
      users: admin.users ?? []
    });
  });
  fastify.post("/user", async (req, res) => {
    const { token } = req.headers;
    const { locations = [], ...person } = req.body;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email }, include: { users: true } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    if (!person.email || !person.name) {
      res.status(400).send({ error: "Invalid User" });
    }
    const user = await prisma.user.create({
      data: {
        email: person.email,
        name: person.name,
        adminId: admin.id,
        locations: {
          create: locations.map((l) => ({
            lat: l.lat.toString(),
            lng: l.lat.toString()
          }))
        }
      },
      include: { locations: true }
    });
    return {
      user
    };
  });
  fastify.patch("/user/:email", async (req, res) => {
    const { token } = req.headers;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    const user = await prisma.user.update({
      where: { email: req.params.email },
      data: { email: req.body.email, name: req.body.name }
    });
    res.send({ user });
  });
  fastify.delete("/user/:email", async (req, res) => {
    const { token } = req.headers;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    await prisma.user.delete({ where: { email: req.params.email } });
    return { ok: true };
  });
  fastify.get("/location", async (req, res) => {
    const { token } = req.headers;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    const locations = await prisma.location.findMany({ where: { User: { adminId: admin.id } } });
    return {
      locations: locations ?? []
    };
  });
  fastify.post("/location/:userEmail", async (req, res) => {
    const { token } = req.headers;
    const { lat, lng } = req.body;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    await prisma.user.update({
      where: { email: req.params.userEmail },
      data: {
        locations: {
          create: {
            lat: lat.toString(),
            lng: lng.toString()
          }
        }
      }
    });
    return {};
  });
  fastify.get("/location/:userEmail", async (req, res) => {
    const { token } = req.headers;
    const { userEmail } = req.params;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    const user = await prisma.user.findFirst({ where: { email: userEmail }, include: { locations: true } });
    return {
      locations: (user == null ? void 0 : user.locations) ?? []
    };
  });
  fastify.patch("/location/:locationId", async (req, res) => {
    const { token } = req.headers;
    const { locationId } = req.params;
    const { lat, lng } = req.body;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    const location = await prisma.location.update({
      where: { id: locationId },
      data: { lat, lng }
    });
    return { location };
  });
  fastify.delete("/location/:locationId", async (req, res) => {
    const { token } = req.headers;
    const email = getEmailFromToken(token);
    const admin = await prisma.admin.findFirst({ where: { email } });
    if (!(admin == null ? void 0 : admin.id)) {
      return res.status(401).send({});
    }
    const location = await prisma.location.delete({
      where: { id: req.params.locationId }
    });
    return { location };
  });
};

// src/app.ts
var server = (0, import_fastify.default)({});
var start = async () => {
  await root(server, {});
  await server.listen({
    host: "0.0.0.0",
    port: 3e3
  });
  console.log("running on port 3000");
};
start();

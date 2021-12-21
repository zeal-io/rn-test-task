import backup from "./db.json"

export const db: DB = {
  data: backup.data,
  users: backup.users,
}

export type Person = {
  name?: string
  email: string
  locationsIndexes: Record<string, boolean>
}

export type Location = {
  lat: number
  lng: number
}

export type DB = {
  users: {
    [email: string]: {
      password: string
      name?: string
    }
  }
  data: {
    [userEmail: string]: {
      users: Record<string, Person>
      locations: Record<string, Location>
    }
  }
}

export const SEPERATOR = ";;;"

export function persistDB() {
  require("fs").writeFileSync("./src/db.json", JSON.stringify(db, null, 2))
}

export function authenticateUser(token: string) {
  const [email, password] = token.split(SEPERATOR)
  console.log({ email, password })

  if (!email || !password || !db.users[email] || db.users[email].password !== password) {
    return { error: "Invalid token" }
  }

  return {
    email,
    password,
  }
}

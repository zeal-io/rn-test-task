type Person = {
  name?: string
  email: string
  locationsIndexes: Record<string, boolean>
}

type LocationPoint = {
  lat: number
  lng: number
}

type DB = {
  users: {
    [email: string]: {
      password: string
      name?: string
    }
  }
  data: {
    [userEmail: string]: {
      users: Record<string, Person>
      locations: Record<string, LocationPoint>
    }
  }
}

type Register = {
  Body: { email: string; password: string; name: string }
}

type Login = {
  Body: { email: string; password: string }
}

type DeleteLocation = {
  Headers: { token: string }
  Params: { locationId: string }
}

type PatchLocation = {
  Params: { locationId: string }
  Headers: { token: string }
  Body: { lat: string; lng: string }
}

type GetLocations = {
  Headers: { token: string }
  Params: { userEmail: string }
}

type AddLocation = { Headers: { token: string }; Params: { userEmail: string }; Body: { lat: number; lng: number } }

type GetAllLocations = { Headers: { token: string } }

type DeleteUser = { Params: { email: string }; Headers: { token: string } }

type EditUser = { Headers: { token: string }; Body: Omit<Person, "locationsIndexes">; Params: { email: string } }

type CreateUser = { Headers: { token: string }; Body: { locations: LocationPoint[] } & Omit<Person, "locationsIndexes"> }

type GetUser = { Headers: { token: string } }

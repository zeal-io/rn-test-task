# Test Task.

## Description

[Deisgn](https://excalidraw.com/#json=WBj4x0g9XO3eLyt4xrL22,HPnVzvjotfvXZhxvaxfPSQ)

[API base url](http://ec2-44-204-28-7.compute-1.amazonaws.com:3000)

### candidate needs to use typescript and react query, you may use other libs as needed.

**given he design above, create a React native app that have the following screens.**

## Auth Screens

> the screens allows the admin to login / register, once the user is logged in **or** register, they should be navigated to The Users Screen & their login status should be persisted.

```ts
POST `/register`
body:    { email: string; password: string; name: string }
returns: {
  token: string,
  admin: { email: string; name: string }
 }


POST `/login`
body:    { email: string; password: string;}
returns: {
  token: string,
  admin: { email: string; name: string }
 }
```

## User List Screen

```ts
GET `/user`
Headers: { token: string }

returns {
  users: {name: string, email: string}[]
}

GET `/location` //- GEt all locations regardless of the user
Headers: { token: string }
returns {
  locations: {lat: number, lng: number}[]
}
```

## User Details screen

```ts
  GET `/location/:userEmail`
  Headers: { token: string }
  returns {
    locations: {lat: number, lng: number}[]
  }

  DELETE `/location/:locationId`
```

## Add / Edit User

> the screen allows the user to add / edit user, you should use the same screen / component for both functionality, ability to add location should be removed when editing a user.

```ts
  POST `/user`
  Headers: { token: string }
  body {
    locations: {lat: number, lng: number}[]
    name: string
    email: string
  }

  PATCH `/user/:userEmail`
  Headers: { token: string }
  {
    locations: {lat: number, lng: number}[]
    name: string
    email: string
  }
```

## Add Location Screen

> You can Navigate to this screen from the User Details screen as well as from the Add User screen, if the user is navigated from the user details screen, the screen is responsible for making the http request to add a loction, if the user is navigated from the Add user screen, it is not responsible for creating the location because there is no user to associate the location to, the Add screen will handle the location creating along with the user creation.

```ts
  POST `/location/:userEmail`
  Headers: { token: string }
  body: {lat: number, lng: number }
```

To Delete a location

```ts
DELETE`/location/:locationId`
Headers: {
  token: string
}
```

to get users locations

```ts
GET`/location/:userEmail`
Headers: {
  token: string
}
```

to delete a user

```ts
DELETE`/user/:userEmail`
Headers: {
  token: string
}
```

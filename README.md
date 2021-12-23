# Test Task.

[Deisgn](https://excalidraw.com/#json=0CjQItfIb4QhikAgV6l24,s1vc1m5913MTjUxzc8Dpug)

Descriptions:

> given he design above, create a React native app that have the following screens.

## Auth Screen

> the screen allows the user to login & register, once the user is logged in or register, they should be navigated to The Users Screen & their login status should be persisted.

```ts
POST `/register`
body:    { email: string; password: string; name?: string }
returns: {token: string}


POST `/login`
body:    { email: string; password: string;}
returns: {token: string}
```

## User List Screen

```ts
GET `/user`
returns {
  users: {name: string, email: string}[]
}


GET `/location` // returns all locations regardless of user
returns {
  locations: {lat: number, lng: number}[]
}
```

## User Details screen

```ts
  GET `/location/:userEmail`
  returns {
    locations: {lat: number, lng: number}[]
  }

  DELETE `/location/:locationId`
```

## Add / Edit User

> the screen allows the user to add / edit user, you should use the same screen / component for both functionality, ability to add location should be removed when editing a user.

```ts
  POST `/user`
  body {
    locations: {lat: number, lng: number}[]
    name: string
    email: string
  }

  PATCH `/user/:userEmail`
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
  body: {lat: number, lng: number }
```

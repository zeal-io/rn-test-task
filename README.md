# Test Task.

Deisgn: ://excalidraw.com/#json=Tu34V3HojSdeexHCxoWQ4,w_fLIP95jjEQ1JnjtnACCQ

Descriptions:

> givent he design above, create a React native app that have the following screens.

- Auth Screen
  > this is the screen the logged out user should land on. the screen has 2 tabs login & register, if the user had previously logged in the login tab should be selected, otherwise we should select the register tab by default. use the following end points to register / login

```ts
POST '/register'
body:    { email: string; password: string; name?: string }
returns: {token: string}


POST '/login'
body:    { email: string; password: string;}
returns: {token: string}
```

- Tabbar Screen / Navigator

  > the tabbar has 2 tabs Users & Locations.

  ```ts
  GET '/user'
  returns {
    users: {name: string, email: string}[]
  }


  GET '/location' // returns all locations regardless of user
  returns {
    locations: {lat: number, lng: number}[]
  }
  ```

- User Details screen
  > display user basic info , ability to assosiate a loction to the user, list user locations

```ts
  GET `/location/:userEmail`
  returns {
    locations: {lat: number, lng: number}[]
  }

  POST `/location/:userEmail`
  body: {lat: number, lng: number }


  DELETE `/location/:locationId`
```

- Add User
  > absility to add a user & assosiate loctions to him, after the user is created we should navigate back to an appropriate screen.

```ts
  POST `/user`
  body {
    locations: {lat: number, lng: number}[]
    name: string
    email: string
  }
```


- Add Location Screen
> ability to assosiate a location to a certain user.

TODO

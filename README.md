# Erasys JavaScript Trial Task
Users are very important on ROMEO. That's why we want you to implement an app that shows a list of users. We have included a simple server with two API endpoints that give you the required data.

## Requirements
- Create a JavaScript app (you can use your favorite `npm` packages and frameworks) that shows the results in a layout similar to the following screenshot:
![](./data/mockup.jpg)

- Make sure that a single item shows the following data:
  - Username
  - Age
  - Image
  - Location and distance
  - Headline
  - Relative last login time (e.g. 6 minutes ago)

  *The screenshot above is just an illustration of what we have in mind. Feel free to use it as a starting point, or implement your own design.*

- The app should work on all screen sizes
- Include your `git` history when you send us your code

## Server
1. Clone this repository
2. `npm install`
3. `npm start`
4. The API is available on [http://localhost:3000](http://localhost:3000)

## API description
### `GET /api/search?length=32`
### `GET /api/search?length=32&sorting=[DISTANCE|ACTIVITY]`
Returns a list of user profiles with some basic information.

#### Example output
```javascript
{
  "cursors": {
    "after": (string)
  },
  "total": (number),
  "items": [{
    "id": (string),
    "name": (string),
    "picture": {
      "comment": (string),
      "url": (string)
    },
    ...
  }]
}
```

### `/api/profiles?ids=_id1_&ids=_id2_&ids=...`
Returns an array of detailed user data matching the given ids.

#### Example output
```javascript
[
  {
    "id": (string),
    "location": {
      "name": (string),
      "distance": (number)
    },
    "headline": (string),
    "personal": {
      "age": (number),
      ...
    },
    "sexual": {
      "anal_position": (string),
      ...
    },

    {
      "id": (string),
      ...
    }
]
```

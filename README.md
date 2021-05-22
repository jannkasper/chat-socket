## Encrypted Chat Socket
- Live: https://jkasper-chat-socket.herokuapp.com/ (be patient, server is sleeping)

[![Product Name Screen Shot][product-screenshot]](https://github.com/jannkasper/stackoverflow-next/blob/master/screenshot.png)

## :rocket: Tech Stack

- ReactJs
- Redux
- Socket.io
- Redis
- NodeJs

- Koa

## :warning: Prerequisite

- node
- npm
- redis

## :cd: How to run local

```bash
# Clone this repository
$ git clone https://github.com/jannkasper/encrypted-chat-socket

# Go into server
$ cd encrypted-chat-socket/server

# Create configuration file (copy .env.dist)
$ echo 'STORE_BACKEND=redis' >> .env
$ echo 'STORE_HOST=<redis-url>' >> .env

# Install dependencies
$ npm install

# Start the backend server
$ npm run dev

# On another terminal, go to the client folder
$ cd encrypted-chat-socket/client

# Install dependencies
$ npm install

# Start the frontend client
$ npm run start
```

## :globe_with_meridians: Deploy

#### Deploying Server App on Heroku

- Create a [Heroku](https://dashboard.heroku.com/new-app) new app.
- Add Heroku Redis to resources
- Go to app settings
- Add the following enviroments.
  - STORE_BACKEND = 'redis'
  - STORE_HOST (Redis URL)
- Add Nodejs to buildpacks

-
      # Go into the repository
      $ cd stackoverflow-next
  
      # Heroku Setup
      $ npm install -g heroku
      $ heroku login
      $ heroku git:remote -a your-app-name
  
      # push repository
      $ git push heroku master


## :book: Directory Structure

```
├── app/
│   ├── client/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── actions/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── img/
│   │   │   ├── reducers/
│   │   │   ├── store/
│   │   │   ├── stylesheets/
│   │   │   ├── test/
│   │   │   ├── utils/
│   │   │   ├── index.css
│   │   │   ├── index.js
│   │   │   ├── reportWebVital.js.js
│   │   │   ├── root.js
│   │   │   ├── serviceWorker.js
│   │   │   └── setupTest.js
│   │   │
│   │   └── package.json
│   │
│   └── server/
│       ├── src/
│       │   ├── store/
│       │   │   ├── index.js
│       │   │   ├── Memory.js
│       │   │   └── Redis.js
│       │   ├── index.js
│       │   └── socket.js
│       │
│       ├── .env
│       ├── .env.dist
│       ├── build.sh
│       ├── index.html
│       └── package.json
│    
```

## :memo: License

This project is made available under the MIT License.





<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: screenshot.png

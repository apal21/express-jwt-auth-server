# Express JWT Auth Server
JWT Auth Server implementation in Express.js using _Babel_ and _ESLint Airbnb_.

**Database:**
* MongoDB
* Redis

**Note:** _This server is not meant to connect directly with the frontend as you can set the configurations from the API call and this returns all the server errors(if any) in the response._

## Usage
* First copy/rename `.env.sample` to `.env`
* Generate one `RS256` key-pair and paste the content in the respective fields of `.env` file. Refer [this gist](https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9)
* Setup MongoDB and Redis on your machine.
* Install all the NPM dependencies: `npm i`
* To watch all the changes in development: `npm start`
* To deploy this in production: `npm run production`

## Features
* Multiple User Roles and Verification
* Sign tokens using Public Key encryption
* Verify tokens using Whitelisting strategy
* Written in modern JavaScript
* ESLint pre-commit hook
* Set dynamic expiration time and subject in the token

## Routes
1. [User CRUD routes for admins](https://github.com/apal21/express-jwt-auth-server/wiki/User-CRUD-Routes):
    * `GET` `/users`
    * `POST` `/users`
    * `GET` `/users/:id`
    * `PUT` `/users/:id`
    * `DELETE` `/users/:id`
    
2. [Auth Routes](https://github.com/apal21/express-jwt-auth-server/wiki/Auth-Routes):
    * `POST` `/auth/login`
    * `POST` `/auth/register`
    * `POST` `/auth/forgot`
    * `POST` `/auth/reset/:id`
    * `POST` `/auth/logout`
    * `POST` `/auth/verify`

# Express JWT Auth Server
JWT Auth Server implementation in Express.js using _Babel_ and _ESLint Airbnb_.

**Database:**
* MongoDB
* Redis

**Note:** _Do not directly connect the frontend with this server as this returns all the server errors(if any) in the response._

## Features
* Multiple User Roles and Verification
* Sign tokens using Public Key encryption
* Verify tokens using Whitelisting strategy
* Written in modern JavaScript
* ESLint pre-commit hook

## Routes
1. [User CRUD routes for admins](https://github.com/apal21/express-jwt-auth-server/wiki/User-CRUD-Routes):
    * `GET` `/users`
    * `POST` `/users`
    * `GET` `/users/:id`
    * `PUT` `/users/:id`
    * `DELETE` `/users/:id`
    
2. Auth Routes:
    * `POST` `/auth/login`
    * `POST` `/auth/register`
    * `POST` `/auth/forgot`
    * `POST` `/auth/reset/:id`
    * `POST` `/auth/logout`
    * `POST` `/auth/verify`

<p align="center">
  <a href="https://github.com/ShivaBhattacharjee/Muxik">
    <img src="https://github.com/ShivaBhattacharjee/Muxik/assets/95211406/299e717b-af55-4722-a663-b9b65c90940d" alt="Logo" width="100px" >
  </a>
<br/>
  <h3 align="center">Muxik Backend</h3>
  <p align="center">
    Backend logic for login signup and storing history/liked
    <br/>
    <br/>
    <a href="https://github.com/ShivaBhattacharjee/Muxik-backend/issues">Report Bug</a>
    .
    <a href="https://github.com/ShivaBhattacharjee/Muxik-backend/issues">Request Feature</a>
  </p>
</p>







## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Routes](#routes)
  - [Authentication](#authentication)
    - [POST](#post)
  - [Users / Public](#users--public)
    - [GET](#get)
    - [POST](#post-1)
    - [DELETE](#delete)
    - [PUT](#put)
- [Dummy data](#dummy-data)
  - [Register](#register)
  - [Verify Register](#verify-register)
  - [Login](#login)
  - [Reset Password](#reset-password)
  - [Confirm Reset Password](#confirm-reset-password)
  - [Add Liked songs](#add-liked-songs)
  - [Delete Liked Songs](#delete-liked-songs)
  - [Add History](#add-history)
  - [Delete History](#delete-history)
  - [Update user](#update-user)
- [License](#license)
- [Todo](#todo)
- [Authors](#authors)


## About the Project
This repo contains the backend logic for Muxik, including login, register, forget password, update profile, adding songs to history, adding liked songs, and many more functionalities.
## Built With

Muxik backend api is built using express , Mongodb , JWT and Nodemailer

* [ExpressJs](http://expressjs.com/) 
* [MongoDb](https://www.mongodb.com/) 
* [JWT](https://jwt.io/) 
* [Nodemailer](https://nodemailer.com) 

## Getting Started

### Prerequisites

<a href="https://git-scm.com/downloads" >Git</a> is a distributed version control system used for software development. It allows multiple developers to work on the same codebase simultaneously, keeping track of changes and managing versions. It also enables users to revert changes and collaborate more effectively.



<a href="https://nodejs.org/en/download/">NodeJs</a> is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to execute JavaScript code outside of a web browser, making it possible to create server-side applications with JavaScript. Node.js is fast, lightweight, and scalable, making it popular for building modern web applications.

<a href="https://www.thunderclient.com/">Thunder Client</a>  is a lightweight Rest API client extension for VS Code

### Installation
<b>Rename env.example to env and fill the values</b>
> **⚠️ Note: MongoDb memory server can be used by changing the config inside Database.js**

```sh
git clone https://github.com/ShivaBhattacharjee/Muxik-backend
```
```sh
cd Muxik-backend
```
```sh
npm install
```
To start in development mode

```sh
npm run dev 
```
Or

```sh
npm start
```

## Routes
> **⚠️ Note: Bearer Token can be obtained after successfull login**
### Authentication
#### POST
| Endpoint | Method |Bearer Token | 
| -------- | ----- | ----------- |
| api/validation/register | POST   | No |  | 
| api/verify-register| POST  | No |  
| api/resend-email | POST   | No | 
|api/reset-password|POST |No ||
|api/confirm-reset-password|POST |No |
|api/login|POST |No ||

### Users / Public
> ⚠️ Note: Routes remain the same for both liked and history requests; the method used will determine which function triggers the database queries. The queries depend on the username obtained from the bearer token.


#### GET
| Endpoint | Method |Bearer Token | 
| -------- | ----- | ----------- |
|api/user/liked-songs|GET |Yes 
|api/user/history|GET |Yes |
|api/user/user-info|GET |Yes |
#### POST
| Endpoint | Method |Bearer Token | 
| -------- | ----- | ----------- |
|api/user/liked-songs|POST |Yes 
|api/user/history|POST |Yes |
|api/user/user-info|POST |Yes |

#### DELETE
| Endpoint | Method |Bearer Token | 
| -------- | ----- | ----------- |
|api/user/liked-songs|DELETE |Yes 
|api/user/history|DELETE |Yes |
#### PUT
| Endpoint | Method |Bearer Token | 
| -------- | ----- | ----------- |
|api/user/user-info|PUT |Yes |  

## Dummy data


### Register
```sh
{
 "username" : "user",
 "password" : "password",
 "email" : "email@gmail.com",
 "profile" : "thisIsImage"
}
```
### Verify Register
```sh
{
  "email" : "email@gmail.com", 
  "verificationCode" : "code"
}
```
> **⚠️ Note: Only users verified via otp can login**
### Login

```sh
{
  "username":"user",
  "password" : "password"
}
```

### Reset Password
```sh
{
   "email": "email of registered user"
}
```

### Confirm Reset Password
```sh
{
  "email": "email@gmail.com",
  "otp": "otp",
  "newPassword": "new password"
}
```

### Add Liked songs
```sh
{
  "username": "user",
  "songId": "1234",
  "songName": "test song",
  "banner": "https://example.com/song_banner.jpg"
}
```
### Delete Liked Songs
```sh
{
  "songId" : "song id"
}
```
### Add History

```sh
{
  "username": "user",
  "songId" : "1234", 
  "songName" : "test song", 
  "banner" : "https://example.com/song_banner.jpg"
}
```
### Delete History

```sh
{
  "songId" : "song id"
}
```
### Update user
```sh
{
  "username" : "new username"
  "profile" : "new profile"
}
```
## License

Distributed under MIT License . See [LICENSE](https://github.com/ShivaBhattacharjee/Muxik-backend/blob/main/LICENSE) for more information.


## Todo
- ✅ Register and verify 
- ✅ OTP Resend
- ✅ Login 
- ✅ Get User info 
- ✅ Update user profile
- ✅ Reset Password 
- ✅ custom email for register account and reset passowrd 
- ✅ Verify Reset password
- ✅ Liked Songs
- ✅ History
- ❌ Custom Playlists
- ✅ Code Refactoring
## Authors

* **Shiva Bhattacharjee** - [Shiva Bhattacharjee](https://github.com/ShivaBhattacharjee) 


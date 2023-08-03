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

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Routes](#routes)
  * [GET](#get)
  * [POST](#post)
   * [PUT](#put)
  * [DELETE](#delete)
* [Dummy data](#dummy-data)
  * [Register](#register)
  * [Login](#login)
  * [Reset Password](#reset-password)
    * [Verify Reset Password](#verify-reset-password)
  * [Add Liked songs](#add-liked-songs)
  * [Add song history](#add-history)
  * [Update User](#get)
* [Contributing](#contributing)
* [Issue Template](#raising-an-issue)
* [License](#license)
* [Todo](#todo)
* [Authors](#authors)


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
### GET
| Endpoint | Method |Bearer Token |
| -------- | ----- | ----------- |
| api/user/username | GET   | Required |
| api/liked-songs/username | GET   | Required |
| api/song-history/username | GET   | Required | 

### Post
| Endpoint | Method |Bearer Token | 
| -------- | ----- | ----------- |
| api/register | POST   | No |  | 
| api/verify-register?email=email&verificationCode=code| POST  | No |  
| api/resend-email?email=email | POST   | No | 
|api/reset-password|POST |No ||
|api/verify-reset-password|POST |No |
|api/login|POST |No ||
|api/add-liked-songs|POST |Yes |
|api/add-song-history|POST |Yes |

### Put
| Endpoint | Method |Bearer Token |
| -------- | ----- | ----------- |
| api/update-user?username=username  | PUT  | YES   |  

### Delete
| Endpoint | Method |Bearer Token |
| -------- | ----- | ----------- |
| api/delete-liked-songs/:username/:songId  | DELETE | YES   |  
| api/delete-song-history/:username/:songId | DELETE  | YES   |  

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

#### Verify Reset Password
```sh
{
  "email": "email@gmail.com",
  "otp": "otp",
  "newPassword": "heythere"
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
### Add History

```sh
{
  "username": "user",
  "songId" : "1234", 
  "songName" : "test song", 
  "banner" : "https://example.com/song_banner.jpg"
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


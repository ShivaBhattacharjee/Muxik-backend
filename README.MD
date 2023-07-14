> **⚠️ Note: This project is still under development.**

## Todo
- ✅ Register Route and email
- ✅ Verify Register Route
- ✅ Login Route
- ✅ Update user Route
- ✅ Get User info route
- ✅ Reset Password route and email
- ❌ Verify Reset passowrd
- ❌ Liked Songs
- ❌ History
- ❌ Custom Playlists

###  Installation
docker image will be availabe soon

local : 
Fill out all the values inside .env.local file and rename it to .env
```bash
git clone https://github.com/ShivaBhattacharjee/Muxik-backend
cd Muxik-backend 
npm i 
npm start /to normally start the server
npm dev / to start in developement mode

```
 ### <b>All api routes</b> 
<i>dummy data to make register request only username and password data is required for login route </i>
 ```bash
{
  "username" : "user",
  "password" : "password",
  "email" : "user@gmail.com",
  "profile" : ""
}
 ```
               
| API ROUTES          | Type     | Description                                                                                                                     |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `/api/register` | POST   | Make a post request to register a user (username, email, and password are mandatory, profile is optional)  |
| `/api/verify-register?email=<email.id>`    | PUT   | takes verificationCode as a body request and verifies the user  
| `/api/login`    | POST   | Make a post request with the email and password to retrieve data                                                            |
| `/api/use/userid`    | GET   | Shows user information and profile   
| `/api/updateuser?id=<user.id>`    | PUT   | Updates user profile         
| `/api/updateuser?id=<user.id>`    | PUT   | Updates user profile     
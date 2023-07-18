> **⚠️ Note: This api is still under development.**

## Todo
- ✅ Register and verify 
- ✅ Login 
- ✅ Get User info 
- ✅ Update user profile
- ✅ Reset Password 
- ✅ custom email for register account and reset passowrd 
- ✅ Verify Reset passowrd
- ✅  Liked Songs
- ❌ History
- ❌ Custom Playlists

###  Installation

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
| `/api/user/userid`    | GET   | Shows user information and profile   
| `/api/update-user?id=<user.id>`    | PUT   | Updates user profile         
| `/api/verify-reset-password`    | POST   | accepts otp and email and new password as body data    
###  Installation
docker image will be availabe soon

local : 

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
| `/api/login`    | POST   | Make a post request with the email and password to retrieve data                                                            |
| `/api/use/userid`    | GET   | Shows user information and profile   
| `/api/updateuser?id=<user.id>`    | PUT   | Updates user profile         
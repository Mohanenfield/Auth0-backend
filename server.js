const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");

const app = express();

app.use(cors());

var verifyJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-4jfs6iq5.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'this is a unique API',
  issuer: 'https://dev-4jfs6iq5.us.auth0.com/',
  algorithms: ['RS256']
}).unless({path:['/']});

app.use(verifyJwt);


app.get("/", (req,res)=>{
    res.send("Hello from index route");
});

 app.get("/protected",  async (req,res)=>{
    const accessToken = req.headers.authorization.split(" ")[1];
    const response = await axios.get("https://dev-4jfs6iq5.us.auth0.com/userInfo", {
        headers : {
            authorization : `Bearer ${accessToken}`
        }
    });
    const userInfo = response.data;
    console.log(userInfo)
    res.send(userInfo);
});

app.listen(5000, ()=>console.log("Server running on port 5000"));
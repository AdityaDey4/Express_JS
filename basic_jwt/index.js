
const PORT = 4000; 

require('dotenv/config'); // this can make sure that we can use env variable in this file
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {hash, compare} = require("bcrypt");
const {verify} = require("jsonwebtoken");

const token = require("./src/token");
const {isAuth} = require("./src/isAuth");

const {fakeDB} = require("./src/fakeDB");


// 1. Register user
// 2. Login user
// 3. Logout user
// 4. Setup a protected route
// 5. Get a new access token with a refresh token

const server = express();

server.use(cors());
server.use(express.urlencoded({extended: false}));
server.use(express.json());
server.use(cookieParser());

server.get("/", (req, res)=> {
    res.sendStatus(200);
});

// Register a user
server.post("/register", async (req, res)=> {

    const{ email, password} = req.body;
    try {

        const user = fakeDB.find(user=> user.email == email);
        if(user) {
            return res.json({"message" : email+" is registered already"});
        }
        const hashedPassword = await hash(password, 10);
        console.log(hashedPassword);
        
        res.json({"success" : "Successfully registered."});
    }catch(err) {
        res.json({"error" : err.message});
    }
});

// Login a user
server.post("/login", async (req, res)=> {
    const{ email, password} = req.body;

    try {

        const user = fakeDB.find(user=> user.email == email);
        if(!user) {
            return res.json({"message" : "User does not exist."});
        }

        const valid = await compare(password, user.password);
        if(!valid) {
            return res.json({"message" : "Password is not matching."})
        }

        const accessToken = token.createAccessToken(user.id);
        const refreshToken = token.createRefreshToken(user.id);

        user.refreshToken = refreshToken;
        console.log(fakeDB);

        token.sendRefreshToken(res, refreshToken);
        token.sendAccessToken(res, accessToken);

    }catch(err) {
        console.error(err.message);
    }
});

// logout a user
server.post("/logout", (req, res)=> {
    res.clearCookie("refreshToken", {path : "/refresh_token"});
    console.log(fakeDB);

    return res.json({"success" : "User logged out successfully."});
});

// setup a protected route
server.post("/protected", async (req, res)=> {

    try {

        isAuth(req, res);
    }catch(err) {
        res.json({"error" : err.message});
    }
}); 

// new access token with refresh token
server.post("/refresh_token", (req, res)=> {

    const myToken = req.cookies.refreshToken;
    if(!myToken) {
        return res.sendStatus(401);
    }

    let playload = null;
    try {
        playload = verify(myToken, process.env.REFRESH_TOKEN_SECRET);
    }catch(err) {
        res.json({"error" : err.message});
    }

    const user = fakeDB.find(user=> user.id === playload.userId);
    if(!user) {
        return res.json({"message" : "user did not exist"});
    }

    if(user.refreshToken !== myToken) {
        console.log(myToken);
        return res.json({"message" : "refresh token is not matching"});
    }

    const newAccessToken = token.createAccessToken(user.id);
    const newRefreshToken = token.createRefreshToken(user.id);
    user.refreshToken = newRefreshToken;

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly : true,
        path : "/refresh_token"
    });
    
    console.log(fakeDB);

    token.sendAccessToken(res, newAccessToken);
}); 

server.listen(PORT, ()=> {
    console.log("Server running on port "+PORT);
});

// console.log(fakeDB);
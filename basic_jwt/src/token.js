const { sign } = require("jsonwebtoken");
require('dotenv/config');

const createAccessToken = userId=> {
    return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "15m"});
}

const createRefreshToken = userId=> {
    return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {expiresIn : "1h"});
}

const sendAccessToken = (res, accessToken) => {
    res.json({"accessToken" : accessToken});
}

const sendRefreshToken = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        path : "/refresh_token"
    });
}

module.exports = { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken};
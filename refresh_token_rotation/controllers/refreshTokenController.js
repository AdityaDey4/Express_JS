const User = require("../model/User");
const jwt = require("jsonwebtoken");


const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const currRefreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
    // whenever we are checking using chrome then we shold add 'secure: true' to the cookie, or else it will not work in chrome. But in thunder client it will not work. So whenever we are checking through thunder client then we shold not use 'secure: true'.

    const foundUser = await User.findOne({refreshToken : currRefreshToken}).exec();

    // Detecteed refresh token reuse
    if(!foundUser) {

        jwt.verify(
            currRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded)=> {

                if(err) res.sendStatus(403); // if the refresh token expires

                // somebody is reusing valid refresh token
                // Example or Situation
                // user1 logged in and refresh token is rt1
                // user1 refreshing the access token so that the refresh token is also refreshed, suppose the new refresh token is rt2
                // user2 is trying to get new access token or new refresh token using the old refresh token which is rt1 & it is not expired yet.
                // then it's called reusing valid refresh token
                console.log("Refresh token is reusing")
                const hackedUser = await User.findOne({username : decoded.username}).exec();
                hackedUser.refreshToken = [];

                const result = await hackedUser.save();
                console.log(result);
            }
        );
        return res.sendStatus(403); // forbidden
    }

    // valid token
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt=> rt !== currRefreshToken);

    jwt.verify(
        currRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded)=> {

            // refresh token expired
            if(err) {
                console.log("Refresh token has expired");
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
            }
            if(err || foundUser.username !== decoded.username) {
                return res.sendStatus(403);
            }

            // refresh token is still valid
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "username" : foundUser.username,
                        "roles" : roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : '10s'}
            );

            const newRefreshToken = jwt.sign(
                {"username" : foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn : '15s'}
            );
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();
            console.log(result);

            res.cookie('jwt', newRefreshToken, {httpOnly : true, sameSite: "None", maxAge : 24*60*60*1000});
        // whenever we are checking using chrome then we should add 'secure: true' to the cookie, or else it will not work in chrome. But in thunder client it will not work. So whenever we are checking through thunder client then we should not use 'secure: true'.

            res.json({roles, accessToken});
        }
    );
}

module.exports = { handleRefreshToken };
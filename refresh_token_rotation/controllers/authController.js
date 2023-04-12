const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {

    const cookies = req.cookies;
    // console.log("Refresh Token : "+JSON.stringify(cookies));

    const { user, pwd } = req.body;
    if(!user || !pwd) {
        return res.status(400).json({"message" : "Username & Password are required & device should be connected with internet"});
        // 400 : bad request
    }

    const foundUser = await User.findOne({username : user}).exec();

    if(!foundUser) {
        return res.sendStatus(401); // unauthorized
    }

    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match) {
        // create JWTs
        
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
        const refreshToken = jwt.sign(
            {"username" : foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : '1d'}
        );

        const refreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(rt=> rt !== cookies.jwt);

        if(cookies?.jwt) {
            res.clearCookie("jwt", { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
            // whenever we are checking using chrome then we shold add 'secure: true' to the cookie, or else it will not work in chrome. But in thunder client it will not work. So whenever we are checking through thunder client then we shold not use 'secure: true'.
        }

        // user can login through multiple device
        foundUser.refreshToken = [...refreshTokenArray, refreshToken];
        const result = await foundUser.save();
        console.log(result);
        
        res.cookie('jwt', refreshToken, {httpOnly : true, sameSite: "None", maxAge : 24*60*60*1000});
        // whenever we are checking using chrome then we should add 'secure: true' to the cookie, or else it will not work in chrome. But in thunder client it will not work. So whenever we are checking through thunder client then we should not use 'secure: true'.
        res.json({roles, accessToken});
    }else {
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};
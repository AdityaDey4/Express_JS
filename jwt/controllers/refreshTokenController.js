const userDB = {
    users : require("../model/users.json"), 
    setUsers : function(data) {
        this.users = data;
    }
}

const jwt = require("jsonwebtoken");
require("dotenv").config();


const handleRefreshToken = (req, res) => {

    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;
    console.log("refresh token : "+refreshToken);

    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);

    if(!foundUser) {
        return res.sendStatus(403); // forbidden
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded)=> {

            if(err || foundUser.username !== decoded.username) {
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign(
                {"username" : foundUser.username},
                process.env.ACCESS_TOKEN_SECRET, // require('crypto').randomBytes(64).toString("hex")
                {expiresIn : '1m'}
            );
            

            res.json({accessToken});
        }
    );
}

module.exports = { handleRefreshToken };
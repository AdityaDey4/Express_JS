const {verify} = require("jsonwebtoken");

const isAuth = (req, res)=> {
    const authorization = req.headers['authorization']; // this will give us our token

    if(!authorization) {
        return res.sendStatus(401);
    }

    const token = authorization.split(" ")[1];
    console.log(token);

    const {userId} = verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    res.json({"id" : userId});
}

module.exports = {isAuth};
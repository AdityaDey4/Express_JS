const User = require("../model/User");

const handleLogout = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // request success but no content
    }
    const currRefreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken : currRefreshToken}).exec(); // now foundUser is a document

    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = foundUser.refreshToken.filter(rt=> rt !== currRefreshToken);;
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
    // whenever we are checking using chrome then we shold add 'secure: true' to the cookie, or else it will not work in chrome. But in thunder client it will not work. So whenever we are checking through thunder client then we shold not use 'secure: true'.
    res.sendStatus(204);
}

module.exports = { handleLogout };
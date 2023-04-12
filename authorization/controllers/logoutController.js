const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
        this.users = data;
    }
}

const fsPromises = require("fs").promises;
const { json } = require("express");
const path = require("path");

const handleLogout = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // request success but no content
    }

    const refreshToken = cookies.jwt;
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);

    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }

    const otherUsers = userDB.users.filter(person => person.refreshToken != foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: "" };

    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(userDB.users)
    )

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
    // whenever we are checking using chrome then we shold add 'secure: true' to the cookie, or else it will not work in chrome. But in thunder client it will not work. So whenever we are checking through thunder client then we shold not use 'secure: true'.
    res.sendStatus(204);
}

module.exports = { handleLogout };
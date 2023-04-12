const userDB = {
    users : require("../model/users.json"), 
    setUsers : function(data) {
        this.users = data;
    }
}

const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {

    const { user, pwd } = req.body;
    if(!user || !pwd) {
        return res.status(400).json({"message" : "Username & Password are required"});
        // 400 : bad request
    }

    const foundUser = userDB.users.find(person => person.username === user);

    if(!foundUser) {
        return res.sendStatus(401); // unauthorized
    }

    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match) {
        res.json({"success" : "User "+ user + " loggid in"});
    }else {
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};
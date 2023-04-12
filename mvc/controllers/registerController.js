const userDB = {
    users : require("../model/users.json"), 
    setUsers : function(data) {
        this.users = data;
    }
}

const fsPromises = require("fs").promises;
const path = require("path");

// bcrypt is use to hash the password
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) {
        return res.status(400).json({"message" : "Username & Password are required"});
        // 400 : bad request
    }

    // check for duplicate username in database
    const duplicate = userDB.users.find(person => person.username === user);
    if(duplicate) {
        return res.sendStatus(409); // there is a conflict
    }

    try {

        // encrypt the password
        const hasededPwd = await bcrypt.hash(pwd, 10); // here 10 is salt which makes the password much stronger
        // stote the new user
        const newUser = {"username" : user, "password" : hasededPwd};
        userDB.setUsers([...userDB.users, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(userDB.users)
        );

        console.log(userDB.users);
        res.status(201).json({"success" : 'New User '+user+' has been created'});

    } catch(err) {
        res.status(500).json({"message" : err.message}); // server error
    }
}

module.exports = {handleNewUser};
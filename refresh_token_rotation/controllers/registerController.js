const User = require("../model/User");

// bcrypt is use to hash the password
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) {
        return res.status(400).json({"message" : "Username & Password are required"});
        // 400 : bad request
    }

    // check for duplicate username in database
    const duplicate = await User.findOne({username : user}).exec();
    if(duplicate) {
        return res.sendStatus(409); // there is a conflict
    }

    try {

        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10); // here 10 is salt which makes the password much stronger
        // create & stote the new user
        const result = await User.create({
            "username" : user,
            "password" : hashedPwd
        });

        console.log(result)
        
        res.status(201).json({"success" : 'New User '+user+' has been created'});

    } catch(err) {
        res.status(500).json({"message" : err.message}); // server error
    }
}

module.exports = {handleNewUser};
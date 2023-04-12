const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    username : {
        type: String,
        required: true
    },
    roles : {
        User : {
            type: Number,
            default : 2001
        },
        Editior : Number,
        Admin: Number
    },
    password : {
        type: String,
        required: true
    },
    refreshToken : [String] // array of string
});

module.exports = mongoose.model("User", userSchema);
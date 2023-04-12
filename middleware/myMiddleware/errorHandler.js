const {logEvents} = require("./logEvent");

const errorHandler = (err, req, res, next) => {

    logEvents(err.name+" : "+err.message, "errLog.txt");

    console.log("Problem : "+err.stack);
    res.status(500).send("Problem : "+err.message);
}

module.exports = errorHandler;
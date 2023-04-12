const errorHandler = (err, req, res, next) => {

    console.log("Problem : "+err.stack);
    res.status(500).send("Problem : "+err.message);
}

module.exports = errorHandler;
const filePayLoadExist = (req, res, next)=> {

    if(!req.files) return res.status(400).json({status : "error", message : "Missing File"});

    next();
}

module.exports = filePayLoadExist;
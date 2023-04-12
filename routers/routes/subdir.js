const express = require("express");
const router = express.Router();

const path = require('path');

router.get('^/$|/index(.html)?', (req, res)=> {
    res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});

router.get('/test(.html)?', (req, res)=> {
    res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});

// router.all('*', (req, res)=> { // page not found
//     res.status(404)
    
//     if(req.accepts("html")) {
//         res.sendFile(path.join(__dirname, '..', "views", "404.html"));
//     }else if(req.accepts("json")) {
//         res.sendFile({ error : "404 not found"});
//     }else {
//         res.type("txt").send("404 not found");
//     } 

//     console.log("page not found 404 in subdir");
// });

module.exports = router;
const express = require('express');
const router = express.Router();

const path = require("path");

router.get('/myPage.html|/myPage', (req, res)=> {
    res.sendFile(path.join(__dirname, "..", "views", "myPage.html"));
});

router.get('^/$|/index(.html)?', (req, res)=> {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
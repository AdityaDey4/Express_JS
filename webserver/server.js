const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3500;

app.get('/myPage.html|myPage', (req, res)=> {
    // res.sendFile("./views/myPage.html", {root: __dirname});
    res.sendFile(path.join(__dirname, "views", "myPage.html"));
});

app.get('/check(.html)?', (req, res)=> {
    res.sendFile(path.join(__dirname, "views", "check.html"));
});

app.get('/', (req, res)=> {
    console.log(req.headers.origin);
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get('/anyPage(.html)?|/multiPage(.html)?', (req, res)=> {
    res.redirect(301, "/myPage.html");
});

// ROUTE HANDLERS
app.get('/testing(.html)?', (req, res, next)=> {
    console.log("Testing Route Handlers");
    next();
}, (req, res)=> {
    res.send("Testing the work");
});

// CHAIN OF ROUTE HANDLERS
const one = (req, res, next)=> {
    console.log("one");
    next();
}
const two = (req, res, next)=> {
    console.log("two");
    next();
}
const three = (req, res)=> {
    console.log("three");
    res.send("Finished!");
}

app.get('/chain(.html)?', [one, three, two]);

app.get('/*', (req, res)=> { // page not found
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});


app.listen(PORT, ()=> {
    console.log("Server running on port "+PORT);
});
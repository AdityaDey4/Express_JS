const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const { logger } = require("./myMiddleware/logEvent");
const errorHandler  = require("./myMiddleware/errorHandler");

const PORT = 5500;

// CUSTOM MIDDLEWARE logger
app.use(logger);


// THIRD-PARTY MIDDLEWARE - Cross Origin Resource Sharing

const whitelist = [/*'chrome-untrusted://new-tab-page',*/ 'http://localhost:5500'];
const corsOption = {

    origin : (origin, callback) => {

        if(whitelist.indexOf(origin) != -1 || !origin) { // origin  is undefined or false
            callback(null, true);
        }else {
            callback(new Error("Not Allowed by CORS"));
        }
    },
    optionsSuccessStatus : 200
};
// app.use(cors());
app.use(cors(corsOption)); // will throw an error because origin is not included in the list.


// BUILT-IN MIDDLEWARE to handle urlencoded data in other words, form data;
// 'Content-Type : 'application/x-www-form-urlencoded
// use to handle url-encoded data
app.use(express.urlencoded({extended: false}));

// BUILT-IN MIDDLEWARE for json
app.use(express.json());

// BUILT-IN MIDDLEWARE to serve static files such as css, images even html too.
app.use(express.static(path.join(__dirname, "/public")));



app.get('/myPage.html|/myPage', (req, res)=> {
    // res.sendFile("./views/myPage.html", {root: __dirname});
    res.sendFile(path.join(__dirname, "views", "myPage.html"));
});

app.get('/check(.html)?', (req, res)=> {
    res.sendFile(path.join(__dirname, "views", "check.html"));
});

app.get('/data(.json)?', (req, res)=> {
    res.sendFile(path.join(__dirname, "data", "data.json"));
});

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.all('*', (req, res)=> { // page not found
    res.status(404)
    
    if(req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    }else if(req.accepts("json")) {
        res.sendFile({ error : "404 not found"});
    }else {
        res.type("txt").send("404 not found");
    } 
});

// CUSTOM ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log("Server running on port "+PORT);
});
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const { logger } = require("./myMiddleware/logEvent");
const errorHandler  = require("./myMiddleware/errorHandler");

const PORT = 5500;

// CUSTOM MIDDLEWARE logger
app.use(logger);

const whitelist = ['chrome-untrusted://new-tab-page', 'http://localhost:5500'];
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

app.use(cors(corsOption)); // will throw an error because origin is not included in the list.

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, "/public")));
app.use('/subdir', express.static(path.join(__dirname, "/public"))); // use public folder in subdir folder

app.use('/', require('./routes/root'));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

app.all('/*', (req, res)=> { // page not found
    res.status(404)
    
    if(req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    }else if(req.accepts("json")) {
        res.sendFile({ error : "404 not found"});
    }else {
        res.type("txt").send("404 not found");
    } 
    console.log("page not found 404");
});

// CUSTOM ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log("Server running on port "+PORT);
});
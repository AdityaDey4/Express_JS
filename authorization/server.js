const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { logger } = require("./myMiddleware/logEvent");
const errorHandler  = require("./myMiddleware/errorHandler");
const rootRoutes = require('./routes/root');
const verifyJWT = require("./myMiddleware/verifyJWT");
const corsOption = require("./config/corsOption");
const credentials = require("./myMiddleware/credentials");


const PORT = 5500;

// CUSTOM MIDDLEWARE logger
app.use(logger);

// handle option credintial check - before CORS
// ans fetch cookies credintials requirement
app.use(credentials);

app.use(cors(corsOption)); // will throw an error because origin is not included in the list.

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, "/public")));

app.use('/', rootRoutes);
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT); // this works as a waterfall. So, after it all the route will use verifyJWT
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
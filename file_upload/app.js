const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const filePayLoadExist = require("./middleware/filePayloadExist");
const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const PORT = process.env.PORT || 3500;
const app = express();

app.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/upload",
    fileUpload({createParentPath : true}), // middleware
    filePayLoadExist,
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.pdf']),
    fileSizeLimiter,
    (req, res)=> {
        const files = req.files; // 'files' comes form the middleware & it is array of objects of files 
        console.log(files);

        Object.keys(files).forEach(key=> { // key is the specific file

            // console.log(files[key]); // files[key] is the object of specific file
            const filePath = path.join(__dirname, "inputFiles", files[key].name);
            files[key].mv(filePath, (err)=> { // express-fileupload has this 'mv' function
                if(err) {
                    console.log(err);
                    return res.status(500).json({status : "error", message : err});
                }
            })
        })

        return res.json({status : "Success", message : Object.keys(files).toString()});
    }
)



app.listen(PORT, ()=> {
    console.log("Server running on PORT : "+PORT);
})
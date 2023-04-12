const whitelist = [
    'chrome-untrusted://new-tab-page', 
    'http://localhost:5500'
];


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

module.exports = corsOption;
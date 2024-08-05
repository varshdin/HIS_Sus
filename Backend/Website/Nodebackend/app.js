const express = require("express");
const bodyParser = require("body-parser");
const app = express();

JWT = module.exports = require("jsonwebtoken");
path = module.exports = require("path");
fs = module.exports = require("fs");
randomString = module.exports = require("randomstring");
logger = module.exports = require("./common/logger");
const AWS = module.exports = require('aws-sdk');

_ = module.exports = require("underscore");
request = module.exports = require('request');

APP_PATH = module.exports = __dirname;

CONFIG = module.exports = require("./config/config.json");

//app.use(express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "public"), {maxAge : '50d'}));
app.use(express.static(path.join(__dirname,'build/front/'),{maxAge : '1d'}));

__ = module.exports = require("./common/common");

const helmet = require("helmet");

//Helmet protection
if (CONFIG.MODE != "Development") {
  app.use(helmet());
}

if (CONFIG.MODE == "Development") {
  var cors = require("cors");
  logger.info("APP is running with allow CORS request");
  app.use(cors());
}

var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images/companies/uploaded-logo'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + __.ext(file.originalname))
  }
})
LOGO_STORAGE = module.exports = multer({ storage: storage })

// MAIL
module.exports = _Mail = require("./mails/mail.js");

const { Client } = require('pg');

AWSClient = module.exports = new Client({
  user: 'fuas',
  host: 'sustainability.cvnuvcym0gmh.eu-central-1.rds.amazonaws.com',
  //database: 'germansustainability',
  database:'Sustainability',
  password: 'fuas2022!',
  port: 5432, // or the port you specified
});

AWSClient.connect().then(() => {
  console.log("Aws Data base connect successful")
}).catch((error) => {
  console.log(error);
} );

AWS.config.update({region: 'us-east-1'});

// Configure AWS S3
S3 = module.exports = new AWS.S3();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ type: "text/html" }));

sendmail = module.exports = require('sendmail')();

//Controllers
require("./controller/__init__");

//Routing
const API = require("./routes/api");
const ADMIN = require("./routes/admin");
const WEB = require("./routes/web");


//app.use("/", WEB);
app.use("/api/v1", API);
app.use("/api/v1/admin", ADMIN);
app.use("/", WEB);

var nodemon = require("nodemon");
nodemon[app];

// Export App

module.exports = app;

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var studentSchema = require('./model/student');
var bookSchema = require('./model/book');
var rentalRecordSchema = require('./model/rentalRecord');
var fs = require('fs');
var path = require('path');
app.set("view engine", "ejs");
require('dotenv').config();
 
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
.then(console.log("DB Connected"))
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})
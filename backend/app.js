import express from 'express';
var app = express();
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import studentRoutes from './routes/studentRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import rentalRecordRoutes from './routes/rentalRecordRoutes.js';
app.set("view engine", "ejs");
import dotenv from 'dotenv';
dotenv.config();

 
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
.then(console.log("DB Connected"));
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/student', studentRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/rentalRecord', rentalRecordRoutes);

var port = process.env.PORT || '3000';
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port);
});

const dotenv = require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT || 5001 ;
connectDb();
app.use(express.json());

app.use(errorHandler);
app.use('/api/users',require('./routes/userRoutes'));
app.use('',require('./routes/main'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


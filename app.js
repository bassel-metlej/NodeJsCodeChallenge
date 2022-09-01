const express = require('express');
const conf = require('./config/mongo.js');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tags');
const dotenv = require('dotenv').config();
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    //added to solve the Cors errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS ,GET, POST, PUT, PATCH,DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/auth', authRoutes);
app.use('/note', noteRoutes);
app.use('/category', categoryRoutes);
app.use('/tag', tagRoutes);

app.use((req, res, next) => {
    next(new Error('notFound'));
});

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = { message: error.message };
    res.status(status);
    res.send(message);
});

app.listen(process.env.PORT, () => {
    console.log(`server listening to port ` + process.env.PORT);
});

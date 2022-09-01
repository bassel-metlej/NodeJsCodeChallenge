const mongoose = require('mongoose');

mongoose
    .connect('mongodb://127.0.0.1:27017')
    .then((result) => {
        console.log('CONNECTED TO MONGO LOCALLY');
    })
    .catch((err) => console.log(err));

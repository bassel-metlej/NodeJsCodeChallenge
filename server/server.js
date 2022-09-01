const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'basselmt2022@gmail.com',
        pass: 'xnavyvtxquvbzzzg',
    },
});

let sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        }
    });
};

module.exports = sendMail;

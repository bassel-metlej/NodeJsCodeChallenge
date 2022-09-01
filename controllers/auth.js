const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { signUpSchemaVal } = require('../middlewares/validation/userValidation');
const { logInSchemaVal } = require('../middlewares/validation/userValidation');
const sendMail = require('../server/server');

exports.signup = async (req, res, next) => {
    try {
        const { email, password } = await signUpSchemaVal.validateAsync(
            req.body
        );
        const hashd = await bcrypt.hash(password, 12);
        console.log(hashd);
        console.log('email,pass', email, password);
        const userr = await user.findOne({ email: email });
        if (userr)
            return res.json({ message: `${userr.email} is already exist` });
        console.log('usrrr', userr);
        const nwUser = await user.create({
            password: hashd,
            email: email,
        });
        console.log(nwUser);

        let mailOptions = {
            from: 'basselmt2022@gmail.com',
            to: email,
            subject: 'Welcome!',
            text: 'Welcome! you are a new user',
        };

        sendMail(mailOptions);

        return res.json({
            message: `${email} welcome to our website!`,
            data: nwUser,
        });
    } catch (e) {
        console.log(e);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = await logInSchemaVal.validateAsync(
            req.body
        );

        const userr = await user.findOne({ email });
        if (!userr) {
            console.log('A user with this email could not found!');
            const error = new Error('A user with this email could not found!');
            error.statusCode = 422;
            throw error;
        }
        const result = await bcrypt.compare(password, userr.password);
        if (!result) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: userr.email,
                userId: userr._id.toString(),
            },
            'somesecretsomesecretsecret',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'welcome',
            token: token,
            userId: userr._id.toString,
        });
    } catch (e) {
        next(e);
    }
};

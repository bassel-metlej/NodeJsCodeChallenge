const Post = require('../../models/tags'); //so hon be3mel import lal model li 3mlt l schema bi alba
const user = require('../../models/user');

exports.createTag = async (req, res, next) => {
    const id = req.userId;

    const exists = await user.findOne({ _id: id });
    if (!exists) return res.end();
    try {
        const { name } = req.body;

        const p = await Post.create({
            name: name,
            creator: id,
        });
        console.log(p);
        res.send(p);
    } catch (err) {
        console.log(err);
    }
};

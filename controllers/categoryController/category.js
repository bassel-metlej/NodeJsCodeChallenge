const Post = require('../../models/category');
const notes = require('../../models/notes');
const user = require('../../models/user');
const updateCategorySchemaVal = require('../../middlewares/validation/categoryValidation/categoryValidation');
const createCategorySchemaVal = require('../../middlewares/validation/categoryValidation/categoryValidation');

exports.createCatgory = async (req, res, next) => {
    const id = req.userId;
    const exists = await user.findOne({ _id: id });
    if (!exists) return res.end();
    try {
        const { name, content } = await createCategorySchemaVal.validateAsync(
            req.body
        );

        const CategoryExists = await Post.findOne({ name: name });

        if (CategoryExists) {
            const error = new Error('Category Already exist!');
            error.statusCode = 409;
            throw error;
        }

        const postCategory = await Post.create({
            name: name,
            content: content,
            creator: id,
        });
        res.send(postCategory);
    } catch (err) {
        next(err);
    }
};

//DELETE CATEGORY
exports.deleteCategory = async (req, res, next) => {
    const id = req.userId;

    const exists = await user.findOne({ _id: id });
    if (!exists) {
        return res.end();
    } else {
        try {
            const categoryId = req.params.categoryId;
            const categoryexists = await Post.findOne({
                _id: categoryId,
            });
            if (!categoryexists) {
                const error = new Error('could not find any category');
                error.statusCode = 404;
                throw error;
            } else {
                console.log('i found it');
                const note = await notes.find({
                    categoryID: categoryId,
                });
                if (note) {
                    console.log('exists');
                    await notes.deleteMany({
                        categoryID: categoryId,
                    });
                    await Post.deleteOne({
                        _id: categoryId,
                    });
                    return res
                        .status(200)
                        .json({ message: 'Category deleted!' });
                } else {
                    await Post.deleteOne({
                        _id: categoryId,
                    });

                    return res.status(200).json({
                        message: 'Category deleted.',
                    });
                }
            }
        } catch (e) {
            next(e);
        }
    }
};

//updateCategory
exports.updateCategory = async (req, res, next) => {
    const userId = req.userId;
    const exists = await user.findOne({ _id: userId });
    if (!exists) {
        return res.status(404).json({ message: 'User Not Found!' });
    }

    try {
        const CategoryId = req.params.categoryId;

        const { name, content } = await updateCategorySchemaVal.validateAsync(
            req.body
        );

        const exists = await Post.findOne({ _id: CategoryId });
        if (!exists) {
            const error = new Error('could not find note');
            error.statusCode = 404;
            throw error;
        } else {
            const update = await Post.updateOne(
                {
                    _id: CategoryId,
                },
                {
                    $set: {
                        name: name,
                        content: content,
                    },
                }
            );

            if (update) {
                res.status(200).json({ message: 'update successfully!' });
            } else {
                const error = new Error('fail');
                error.statusCode = 404;
                throw error;
            }
        }
    } catch (e) {
        next(e);
    }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const userId = req.userId;
        const exists = await user.findOne({ _id: userId });
        if (!exists) {
            return res.end();
        } else {
            const getCategories = await Post.find().sort({
                name: 1,
            });
            if (!getCategories) {
                const error = new Error('Fail!');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: '200', Categories: getCategories });
        }
    } catch (e) {
        next(e);
    }
};

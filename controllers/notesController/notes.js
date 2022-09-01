const {
    creteNoteSchemaVal,
    updateNoteSchemaVal,
} = require('../../middlewares/validation/notesValidation/notesValidation');
const Post = require('../../models/notes');
const user = require('../../models/user');
const category = require('../../models/category');
const tags = require('../../models/tags');
const mongoose = require('mongoose');

exports.createNote = async (req, res, next) => {
    const id = req.userId;
    const exists = await user.findOne({ _id: id });
    if (!exists) return res.end();

    try {
        const { categoryID, tagIDs, title, description } =
            await creteNoteSchemaVal.validateAsync(req.body);
        const tagIDsh = tagIDs.map((ele) => {
            return mongoose.Types.ObjectId(ele);
        });
        const result = await Post.create({
            title: title,
            description: description,
            creator: exists._id,
            categoryID: mongoose.Types.ObjectId(categoryID),
            tagIDs: tagIDsh,
        });
        res.send({ result: result });
    } catch (err) {
        return res.json({ message: err, status: '400' });
        next(err);
    }
};

//Delete Note
exports.deleteNote = (req, res, next) => {
    const userid = req.userId;
    const exists = user.findOne({ _id: userid });
    if (!exists) return res.end();

    const postId = req.params.postId;
    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('could not find post');
                error.statusCode = 404;
                throw error;
            }

            return Post.findByIdAndRemove(postId);
        })
        .then((result) => {
            console.log(result);
            res.status(200).json({ message: 'Deleted post!' });
        })
        .catch((err) => {
            console.log('err');
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//updateNote
exports.updateNote = async (req, res, next) => {
    const userId = req.userId;
    const exists = await user.findOne({ _id: userId });
    if (!exists) {
        return res.status(404).json({ message: 'User Not Found!' });
    }

    try {
        const NoteId = req.params.noteId;

        const { title, description } = await updateNoteSchemaVal.validateAsync(
            req.body
        );

        const exists = await Post.findOne({ _id: NoteId });
        if (!exists) {
            const error = new Error('could not find note');
            error.statusCode = 404;
            throw error;
        } else {
            const update = await Post.updateOne(
                {
                    _id: req.params.noteId,
                },
                {
                    $set: {
                        title: title,
                        description: description,
                        updatedAt: Date.now(),
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

exports.getNotesByCat = async (req, res, next) => {
    const userid = req.userId;
    const exists = await user.findOne({ _id: userid });
    if (!exists) return res.end();

    try {
        if (req.body.catId) {
            const categoryid = req.body.catId;

            const categoryExist = await category.findOne({
                _id: categoryid,
            });

            if (!categoryExist) {
                const error = new Error('Category Not Found!');
                error.statusCode = 404;
                throw error;
            }

            const notesByCategory = await Post.aggregate([
                { $match: { categoryID: mongoose.Types.ObjectId(categoryid) } },

                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryID',
                        foreignField: '_id',
                        as: 'categoryID',
                    },
                },

                {
                    $project: {
                        _id: 0,
                        title: 1,
                        description: 1,
                        updatedAt: 1,
                        categoryName: { $arrayElemAt: ['$categoryID.name', 0] },
                        categoryContent: {
                            $arrayElemAt: ['$categoryID.content', 0],
                        },
                    },
                },
                { $sort: { updatedAt: -1 } },
            ]);

            if (!notesByCategory) {
                const error = new Error('fail');
                error.statusCode = 404;
                throw error;
            }

            console.log(notesByCategory);
            res.status(200).json({
                message: 'success!',
                responce: notesByCategory,
            });
        }

        if (req.body.tagss) {
            const Tags = req.body.tagss;
            const tagExist = await tags.findOne({ $text: { $search: Tags } });

            const limit = req.query.limit;
            const page = req.query.page;

            console.log(limit);
            console.log(page);

            if (!tagExist) {
                const error = new Error('Tag Not Found!');
                error.statusCode = 404;
                throw error;
            }

            const taggid = mongoose.Types.ObjectId(tagExist._id);
            const notesByTag = await Post.aggregate([
                { $match: { tagIDs: taggid } },

                {
                    $lookup: {
                        from: 'tags',
                        localField: 'tagIDs',
                        foreignField: '_id',
                        as: 'tagIDs',
                    },
                },

                {
                    $project: {
                        _id: 0,
                        title: 1,
                        description: 1,
                        updatedAt: 1,
                        tagName: { $arrayElemAt: ['$tagIDs.name', 0] },
                    },
                },
                { $sort: { updatedAt: -1 } },

                { $skip: Number((page - 1) * limit) },
                { $limit: Number(limit) },
            ]);
            console.log('notes: ', notesByTag);
            if (!notesByTag) {
                const error = new Error('fail');
                error.statusCode = 404;
                throw error;
            }

            console.log(notesByTag);
            res.status(200).json({ responce: notesByTag });
        }
    } catch (e) {
        next(e);
    }
};

//find with pagination

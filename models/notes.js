const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    categoryID: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    tagIDs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'tags',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },

    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

notesSchema.index({ createdAt: -1 });
notesSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('notes', notesSchema);

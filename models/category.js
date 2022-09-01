const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
});

module.exports = mongoose.model('category', categorySchema);

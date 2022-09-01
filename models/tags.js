const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
});
tagsSchema.index({ name: -1 });

module.exports = mongoose.model('tags', tagsSchema);

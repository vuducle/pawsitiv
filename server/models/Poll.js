const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: {type: String, required: true },
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Poll', pollSchema);
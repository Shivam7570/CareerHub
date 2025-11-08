
const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    content: {
        type: Object,
        required: true,
    },
}, {
    timestamps: true,
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;

const mongoose = require("mongoose");

const battlelogSchema = new mongoose.Schema({
    battlelog: { type: Object, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '86400' }  // This document will be deleted 24 hours after 'createdAt'
    },
});

const Battlelog = mongoose.model("Battlelog", battlelogSchema);

module.exports = Battlelog;

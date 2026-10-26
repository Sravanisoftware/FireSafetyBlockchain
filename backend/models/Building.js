const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
    buildingId: {
        type: String,
        required: true,
        unique: true
    },

    buildingName: {
        type: String,
        required: true
    },

    ownerName: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    buildingType: {
        type: String,
        required: true
    },

    floors: {
        type: Number,
        required: true
    },

    contact: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Building", buildingSchema);
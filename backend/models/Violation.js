const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
    violationId: {
        type: String,
        required: true,
        unique: true
    },

    inspectionId: {
        type: String,
        required: true
    },

    buildingId: {
        type: String,
        required: true
    },

    violationType: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    severity: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        required: true
    },

    status: {
        type: String,
        enum: ["OPEN", "RESOLVED"],
        default: "OPEN"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Violation", violationSchema);
const mongoose = require("mongoose");

const reinspectionSchema = new mongoose.Schema({
    reinspectionId: {
        type: String,
        required: true,
        unique: true
    },

    buildingId: {
        type: String,
        required: true
    },

    violationId: {
        type: String,
        required: true
    },

    inspectorId: {
        type: String,
        required: true
    },

    reinspectionDate: {
        type: Date,
        default: Date.now
    },

    correctiveActionVerified: {
        type: Boolean,
        required: true
    },

    result: {
        type: String,
        enum: ["PASS", "FAIL"],
        required: true
    },

    remarks: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Reinspection", reinspectionSchema);
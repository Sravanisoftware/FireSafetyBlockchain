const mongoose = require("mongoose");

const correctiveActionSchema = new mongoose.Schema({
    actionId: {
        type: String,
        required: true,
        unique: true
    },

    violationId: {
        type: String,
        required: true
    },

    buildingId: {
        type: String,
        required: true
    },

    actionDescription: {
        type: String,
        required: true
    },

    responsiblePerson: {
        type: String,
        required: true
    },

    completionDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ["PENDING", "COMPLETED"],
        default: "PENDING"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("CorrectiveAction", correctiveActionSchema);
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true
    },

    buildingId: {
        type: String,
        required: true
    },

    reinspectionId: {
        type: String,
        required: true
    },

    issueDate: {
        type: Date,
        default: Date.now
    },

    expiryDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "REVOKED"],
        default: "ACTIVE"
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

module.exports = mongoose.model("Certificate", certificateSchema);
const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema({
    inspectionId: {
        type: String,
        required: true,
        unique: true
    },

    buildingId: {
        type: String,
        required: true
    },

    inspectorId: {
        type: String,
        required: true
    },

    inspectionDate: {
        type: Date,
        default: Date.now
    },

    fireExtinguishers: {
        type: Boolean,
        required: true
    },

    emergencyExits: {
        type: Boolean,
        required: true
    },

    fireAlarms: {
        type: Boolean,
        required: true
    },

    sprinklers: {
        type: Boolean,
        required: true
    },

    emergencyLighting: {
        type: Boolean,
        required: true
    },

    fireDoors: {
        type: Boolean,
        required: true
    },

    overallResult: {
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

module.exports = mongoose.model("Inspection", inspectionSchema);
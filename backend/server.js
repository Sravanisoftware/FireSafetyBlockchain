const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { id } = require("ethers");

require("dotenv").config({
    path: "./atlas-credentials.env"
});


// ======================================================
// MONGODB MODELS
// ======================================================

const Building = require("./models/Building");
const Inspection = require("./models/Inspection");
const Violation = require("./models/Violation");
const CorrectiveAction = require("./models/CorrectiveAction");
const Reinspection = require("./models/Reinspection");
const Certificate = require("./models/Certificate");


// ======================================================
// BLOCKCHAIN CONNECTION
// ======================================================

const { contract } = require("./blockchain");


// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

app.use(cors());
app.use(express.json());


// ======================================================
// CONNECT TO MONGODB ATLAS
// ======================================================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err.message);
    });


// ======================================================
// HOME ROUTE
// ======================================================

app.get("/", (req, res) => {
    res.send("Fire Safety Blockchain Backend is Running");
});


// ======================================================
// TEST API
// ======================================================

app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend API is working successfully"
    });
});


// ======================================================
// BUILDING APIs
// ======================================================

// Register a new building
app.post("/api/buildings", async (req, res) => {
    try {

        const building = new Building(req.body);

        const savedBuilding = await building.save();

        res.status(201).json({
            message: "Building registered successfully",
            building: savedBuilding
        });

    } catch (err) {

        console.log("Building error:", err.message);

        res.status(400).json({
            message: "Failed to register building",
            error: err.message
        });

    }
});


// Get all buildings
app.get("/api/buildings", async (req, res) => {
    try {

        const buildings = await Building.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Buildings fetched successfully",
            buildings: buildings
        });

    } catch (err) {

        console.log("Building fetch error:", err.message);

        res.status(500).json({
            message: "Failed to fetch buildings",
            error: err.message
        });

    }
});


// ======================================================
// INSPECTION APIs
// MONGODB + BLOCKCHAIN
// ======================================================

// Create a new inspection
app.post("/api/inspections", async (req, res) => {
    try {

        // Step 1: Save inspection in MongoDB
        const inspection = new Inspection(req.body);

        const savedInspection = await inspection.save();


        // Step 2: Create hash of inspection data
        const dataHash = id(
            JSON.stringify({
                inspectionId: savedInspection.inspectionId,
                buildingId: savedInspection.buildingId,
                inspectorId: savedInspection.inspectorId,
                inspectionDate: savedInspection.inspectionDate,
                fireExtinguishers: savedInspection.fireExtinguishers,
                emergencyExits: savedInspection.emergencyExits,
                fireAlarms: savedInspection.fireAlarms,
                sprinklers: savedInspection.sprinklers,
                emergencyLighting: savedInspection.emergencyLighting,
                fireDoors: savedInspection.fireDoors,
                overallResult: savedInspection.overallResult,
                remarks: savedInspection.remarks
            })
        );


        // Step 3: Store inspection on blockchain
        const tx = await contract.addRecord(
            savedInspection.inspectionId,
            savedInspection.buildingId,
            "INSPECTION",
            savedInspection.overallResult,
            dataHash
        );


        // Step 4: Wait for blockchain confirmation
        await tx.wait();


        // Step 5: Return response
        res.status(201).json({

            message:
                "Inspection saved in MongoDB and blockchain successfully",

            inspection: savedInspection,

            blockchain: {
                transactionHash: tx.hash,
                dataHash: dataHash,
                contractAddress:
                    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
            }

        });

    } catch (err) {

        console.log(
            "Inspection blockchain error:",
            err.message
        );

        res.status(400).json({

            message:
                "Failed to record inspection in MongoDB and blockchain",

            error: err.message

        });

    }
});


// Get all inspections
app.get("/api/inspections", async (req, res) => {
    try {

        const inspections = await Inspection.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Inspections fetched successfully",
            inspections: inspections
        });

    } catch (err) {

        console.log(
            "Inspection fetch error:",
            err.message
        );

        res.status(500).json({
            message: "Failed to fetch inspections",
            error: err.message
        });

    }
});


// ======================================================
// VIOLATION APIs
// MONGODB + BLOCKCHAIN
// ======================================================

// Create a new violation
app.post("/api/violations", async (req, res) => {
    try {

        // Step 1: Save violation in MongoDB
        const violation = new Violation(req.body);

        const savedViolation = await violation.save();


        // Step 2: Create hash of violation data
        const dataHash = id(
            JSON.stringify({
                violationId: savedViolation.violationId,
                inspectionId: savedViolation.inspectionId,
                buildingId: savedViolation.buildingId,
                violationType: savedViolation.violationType,
                description: savedViolation.description,
                severity: savedViolation.severity,
                status: savedViolation.status
            })
        );


        // Step 3: Store violation on blockchain
        const tx = await contract.addRecord(
            savedViolation.violationId,
            savedViolation.buildingId,
            "VIOLATION",
            savedViolation.status,
            dataHash
        );


        // Step 4: Wait for blockchain confirmation
        await tx.wait();


        // Step 5: Return response
        res.status(201).json({

            message:
                "Violation saved in MongoDB and blockchain successfully",

            violation: savedViolation,

            blockchain: {
                transactionHash: tx.hash,
                dataHash: dataHash,
                contractAddress:
                    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
            }

        });

    } catch (err) {

        console.log(
            "Violation blockchain error:",
            err.message
        );

        res.status(400).json({

            message:
                "Failed to record violation in MongoDB and blockchain",

            error: err.message

        });

    }
});


// Get all violations
app.get("/api/violations", async (req, res) => {
    try {

        const violations = await Violation.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Violations fetched successfully",
            violations: violations
        });

    } catch (err) {

        console.log(
            "Violation fetch error:",
            err.message
        );

        res.status(500).json({
            message: "Failed to fetch violations",
            error: err.message
        });

    }
});


// ======================================================
// CORRECTIVE ACTION APIs
// MONGODB + BLOCKCHAIN
// ======================================================

// Create a corrective action
app.post("/api/corrective-actions", async (req, res) => {
    try {

        // Step 1: Save corrective action in MongoDB
        const action = new CorrectiveAction(req.body);

        const savedAction = await action.save();


        // Step 2: Create hash of corrective action data
        const dataHash = id(
            JSON.stringify({
                actionId: savedAction.actionId,
                violationId: savedAction.violationId,
                buildingId: savedAction.buildingId,
                actionDescription: savedAction.actionDescription,
                responsiblePerson: savedAction.responsiblePerson,
                completionDate: savedAction.completionDate,
                status: savedAction.status
            })
        );


        // Step 3: Store corrective action on blockchain
        const tx = await contract.addRecord(
            savedAction.actionId,
            savedAction.buildingId,
            "CORRECTIVE_ACTION",
            savedAction.status,
            dataHash
        );


        // Step 4: Wait for blockchain confirmation
        await tx.wait();


        // Step 5: Return response
        res.status(201).json({

            message:
                "Corrective action saved in MongoDB and blockchain successfully",

            correctiveAction: savedAction,

            blockchain: {
                transactionHash: tx.hash,
                dataHash: dataHash,
                contractAddress:
                    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
            }

        });

    } catch (err) {

        console.log(
            "Corrective action blockchain error:",
            err.message
        );

        res.status(400).json({

            message:
                "Failed to record corrective action in MongoDB and blockchain",

            error: err.message

        });

    }
});


// Get all corrective actions
app.get("/api/corrective-actions", async (req, res) => {
    try {

        const correctiveActions =
            await CorrectiveAction.find()
                .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Corrective actions fetched successfully",
            correctiveActions: correctiveActions
        });

    } catch (err) {

        console.log(
            "Corrective action fetch error:",
            err.message
        );

        res.status(500).json({
            message: "Failed to fetch corrective actions",
            error: err.message
        });

    }
});


// ======================================================
// RE-INSPECTION APIs
// MONGODB + BLOCKCHAIN
// ======================================================

// Create a new re-inspection
app.post("/api/reinspections", async (req, res) => {
    try {

        // Step 1: Save re-inspection in MongoDB
        const reinspection = new Reinspection(req.body);

        const savedReinspection =
            await reinspection.save();


        // Step 2: Create hash of re-inspection data
        const dataHash = id(
            JSON.stringify({
                reinspectionId:
                    savedReinspection.reinspectionId,

                buildingId:
                    savedReinspection.buildingId,

                violationId:
                    savedReinspection.violationId,

                inspectorId:
                    savedReinspection.inspectorId,

                reinspectionDate:
                    savedReinspection.reinspectionDate,

                correctiveActionVerified:
                    savedReinspection.correctiveActionVerified,

                result:
                    savedReinspection.result,

                remarks:
                    savedReinspection.remarks
            })
        );


        // Step 3: Store re-inspection on blockchain
        const tx = await contract.addRecord(
            savedReinspection.reinspectionId,
            savedReinspection.buildingId,
            "REINSPECTION",
            savedReinspection.result,
            dataHash
        );


        // Step 4: Wait for blockchain confirmation
        await tx.wait();


        // Step 5: Return response
        res.status(201).json({

            message:
                "Re-inspection saved in MongoDB and blockchain successfully",

            reinspection:
                savedReinspection,

            blockchain: {
                transactionHash: tx.hash,
                dataHash: dataHash,
                contractAddress:
                    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
            }

        });

    } catch (err) {

        console.log(
            "Re-inspection blockchain error:",
            err.message
        );

        res.status(400).json({

            message:
                "Failed to record re-inspection in MongoDB and blockchain",

            error:
                err.message

        });

    }
});


// Get all re-inspections
app.get("/api/reinspections", async (req, res) => {
    try {

        const reinspections =
            await Reinspection.find()
                .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Re-inspections fetched successfully",
            reinspections: reinspections
        });

    } catch (err) {

        console.log(
            "Re-inspection fetch error:",
            err.message
        );

        res.status(500).json({
            message: "Failed to fetch re-inspections",
            error: err.message
        });

    }
});


// ======================================================
// CERTIFICATE APIs
// MONGODB + BLOCKCHAIN
// ======================================================

// Create a fire safety certificate
app.post("/api/certificates", async (req, res) => {
    try {

        // Step 1: Save certificate in MongoDB
        const certificate = new Certificate(req.body);

        const savedCertificate =
            await certificate.save();


        // Step 2: Create hash of certificate data
        const dataHash = id(
            JSON.stringify({
                certificateId:
                    savedCertificate.certificateId,

                buildingId:
                    savedCertificate.buildingId,

                reinspectionId:
                    savedCertificate.reinspectionId,

                issueDate:
                    savedCertificate.issueDate,

                expiryDate:
                    savedCertificate.expiryDate,

                status:
                    savedCertificate.status,

                remarks:
                    savedCertificate.remarks
            })
        );


        // Step 3: Store certificate on blockchain
        const tx = await contract.addRecord(
            savedCertificate.certificateId,
            savedCertificate.buildingId,
            "CERTIFICATE",
            savedCertificate.status,
            dataHash
        );


        // Step 4: Wait for blockchain confirmation
        await tx.wait();


        // Step 5: Return response
        res.status(201).json({

            message:
                "Fire safety certificate saved in MongoDB and blockchain successfully",

            certificate:
                savedCertificate,

            blockchain: {
                transactionHash: tx.hash,
                dataHash: dataHash,
                contractAddress:
                    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
            }

        });

    } catch (err) {

        console.log(
            "Certificate blockchain error:",
            err.message
        );

        res.status(400).json({

            message:
                "Failed to issue certificate in MongoDB and blockchain",

            error:
                err.message

        });

    }
});


// Get all certificates
app.get("/api/certificates", async (req, res) => {
    try {

        const certificates =
            await Certificate.find()
                .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Certificates fetched successfully",
            certificates: certificates
        });

    } catch (err) {

        console.log(
            "Certificate fetch error:",
            err.message
        );

        res.status(500).json({
            message: "Failed to fetch certificates",
            error: err.message
        });

    }
});


// ======================================================
// START SERVER
// ======================================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});
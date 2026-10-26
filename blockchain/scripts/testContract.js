import { ethers } from "ethers";
import fs from "fs";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const wallet = new ethers.Wallet(privateKey, provider);

const artifact = JSON.parse(
    fs.readFileSync(
        "./artifacts/contracts/FireSafetyCompliance.sol/FireSafetyCompliance.json",
        "utf8"
    )
);

const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    artifact.abi,
    wallet
);

// Add inspection record to blockchain
const tx = await contract.addRecord(
    "INS001",
    "B001",
    "INSPECTION",
    "FAIL",
    "hash-inspection-001"
);

await tx.wait();

console.log("Inspection record added to blockchain.");
console.log("Transaction hash:", tx.hash);

// Read the record from blockchain
const record = await contract.getRecord("INS001");

console.log("\nBlockchain Record:");
console.log("Record ID:", record[0]);
console.log("Building ID:", record[1]);
console.log("Record Type:", record[2]);
console.log("Status:", record[3]);
console.log("Data Hash:", record[4]);
console.log("Timestamp:", record[5].toString());
console.log("Recorded By:", record[6]);

// Verify the stored data hash
const verified = await contract.verifyRecord(
    "INS001",
    "hash-inspection-001"
);

console.log("\nData verification result:", verified);
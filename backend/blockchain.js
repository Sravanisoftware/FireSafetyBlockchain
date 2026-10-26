const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:8545"
);

// Local Hardhat test account
const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contractABI = [
    "function addRecord(string memory _recordId, string memory _buildingId, string memory _recordType, string memory _status, string memory _dataHash) public",
    "function getRecord(string memory _recordId) public view returns (string memory, string memory, string memory, string memory, string memory, uint256, address)",
    "function verifyRecord(string memory _recordId, string memory _dataHash) public view returns (bool)"
];

const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    wallet
);

module.exports = {
    provider,
    wallet,
    contract
};
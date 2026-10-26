# Fire Safety Compliance Management Using Blockchain

## Project Overview

The Fire Safety Compliance Management System is a web-based application designed to manage and monitor fire safety compliance activities in buildings. It integrates blockchain technology to improve the traceability and integrity verification of selected compliance records.

The system enables users to manage building details, record fire safety inspections, track violations, maintain corrective actions, conduct re-inspections, and manage fire safety certificates. Blockchain hashes are used to help detect changes to selected compliance records.

## Objectives

- Digitally manage building fire safety compliance information.
- Record and monitor fire safety inspection results.
- Track safety violations and corrective actions.
- Maintain re-inspection records and manage fire safety certificates.
- Use blockchain hashes to support compliance record integrity verification.
- Improve traceability and organization of fire safety information.

## Technologies Used

- **Frontend:** React.js, Vite, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Blockchain:** Solidity, Hardhat
- **Blockchain Interaction:** Ethers.js

## System Modules

1. **Building Management:** Maintains building details and related information.
2. **Fire Safety Inspections:** Records inspection results for fire extinguishers, emergency exits, fire alarms, sprinklers, emergency lighting, and fire doors.
3. **Violation Management:** Records identified fire safety violations.
4. **Corrective Actions:** Tracks measures taken to address identified violations.
5. **Re-inspections:** Records follow-up inspections and corrective-action verification.
6. **Certificate Management:** Supports management of fire safety certificates.
7. **Blockchain Verification:** Supports verification of data hashes associated with selected compliance records.

## System Architecture

The application consists of three main components:

- **Frontend:** Provides the user interface through React and Vite.
- **Backend and Database:** Uses Node.js, Express.js, and MongoDB Atlas to manage application data.
- **Blockchain Layer:** Uses the `FireSafetyCompliance.sol` smart contract on a local Hardhat development network to record and verify hashes of selected compliance activities.

Building details are stored in MongoDB Atlas. Selected inspection, violation, corrective-action, re-inspection, and certificate records are linked to blockchain entries through their data hashes.

The smart contract provides functions such as `addRecord`, `getRecord`, and `verifyRecord`.

## Project Structure

```text
FireSafetyBlockchain/
├── backend/
│   ├── models/
│   ├── blockchain.js
│   ├── server.js
│   └── package.json
├── blockchain/
│   ├── contracts/
│   │   └── FireSafetyCompliance.sol
│   ├── scripts/
│   │   ├── deploy.js
│   │   └── testContract.js
│   ├── hardhat.config.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
├── .gitignore
├── package.json
└── package-lock.json
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- A MongoDB Atlas account with an accessible database
- A local Hardhat development blockchain

## Installation and Execution

### 1. Clone the Repository

```bash
git clone https://github.com/Sravanisoftware/FireSafetyBlockchain.git
cd FireSafetyBlockchain
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Configure the MongoDB Atlas connection and any other required environment variables using the environment file expected by the backend. Keep credentials private and never commit them to GitHub.

Start the backend:

```bash
node server.js
```

The backend runs at `http://localhost:5000`.

### 3. Start the Local Blockchain

Open another terminal:

```bash
cd blockchain
npm install
npx hardhat node
```

The local blockchain RPC endpoint is `http://127.0.0.1:8545`.

Keep the blockchain terminal running. Deploy the smart contract using the project's deployment script and network configuration before testing blockchain functions.

### 4. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 5. Build the Frontend

To generate a production build of the frontend, run:

```bash
cd frontend
npm run build
```

## API Modules

The backend provides API modules for:

- `/api/buildings`
- `/api/inspections`
- `/api/violations`
- `/api/corrective-actions`
- `/api/reinspections`
- `/api/certificates`
- `/api/test`

## Blockchain Record Integrity

The `FireSafetyCompliance.sol` smart contract stores selected compliance record information, including the record ID, building ID, record type, status, data hash, timestamp, and recorded-by address.

The `verifyRecord` function supports checking whether a supplied data hash matches the hash stored for a blockchain record. Matching hashes indicate consistency with the stored hash; they do not independently prove that the original information was accurate.

## Security Notes

- Never commit MongoDB passwords, private keys, API keys, or environment files containing secrets.
- The local Hardhat blockchain is intended for development and testing.
- Do not use Hardhat's publicly known test private keys for real funds.
- A production deployment would require appropriate security reviews, access controls, and infrastructure configuration.

## Future Enhancements

Potential enhancements include IoT-based fire safety monitoring, automated safety alerts, improved access control, advanced compliance analytics, and deployment to an appropriate production blockchain network.

## Author

**Sravani Gembali**

## Repository

https://github.com/Sravanisoftware/FireSafetyBlockchain

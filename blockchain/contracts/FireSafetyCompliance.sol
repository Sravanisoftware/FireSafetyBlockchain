// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

contract FireSafetyCompliance {

    struct ComplianceRecord {
        string recordId;
        string buildingId;
        string recordType;
        string status;
        string dataHash;
        uint256 timestamp;
        address recordedBy;
    }

    mapping(string => ComplianceRecord) private records;

    event RecordAdded(
        string recordId,
        string buildingId,
        string recordType,
        string status,
        string dataHash,
        uint256 timestamp,
        address recordedBy
    );

    function addRecord(
        string memory _recordId,
        string memory _buildingId,
        string memory _recordType,
        string memory _status,
        string memory _dataHash
    ) public {

        records[_recordId] = ComplianceRecord(
            _recordId,
            _buildingId,
            _recordType,
            _status,
            _dataHash,
            block.timestamp,
            msg.sender
        );

        emit RecordAdded(
            _recordId,
            _buildingId,
            _recordType,
            _status,
            _dataHash,
            block.timestamp,
            msg.sender
        );
    }

    function getRecord(
        string memory _recordId
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            address
        )
    {
        ComplianceRecord memory record = records[_recordId];

        return (
            record.recordId,
            record.buildingId,
            record.recordType,
            record.status,
            record.dataHash,
            record.timestamp,
            record.recordedBy
        );
    }

    function verifyRecord(
        string memory _recordId,
        string memory _dataHash
    )
        public
        view
        returns (bool)
    {
        return keccak256(
            bytes(records[_recordId].dataHash)
        ) == keccak256(
            bytes(_dataHash)
        );
    }
}
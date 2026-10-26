import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const API = "http://localhost:5000";

const BLOCKCHAIN_RPC = "http://127.0.0.1:8545";
const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
  "function getRecord(string memory _recordId) public view returns (string memory, string memory, string memory, string memory, string memory, uint256, address)",
  "function verifyRecord(string memory _recordId, string memory _dataHash) public view returns (bool)"
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [apiStatus, setApiStatus] = useState("Checking...");
  const [buildings, setBuildings] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [violations, setViolations] = useState([]);
  const [correctiveActions, setCorrectiveActions] = useState([]);
  const [reinspections, setReinspections] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);

  // ======================================================
  // BLOCKCHAIN STATE
  // ======================================================

  const [blockchainRecordId, setBlockchainRecordId] =
    useState("");

  const [blockchainRecord, setBlockchainRecord] =
    useState(null);

  const [blockchainLoading, setBlockchainLoading] =
    useState(false);

  const [blockchainError, setBlockchainError] =
    useState("");

  const [verifyHash, setVerifyHash] = useState("");
  const [verificationResult, setVerificationResult] =
    useState(null);

  // ======================================================
  // BUILDING FORM
  // ======================================================

  const [showBuildingForm, setShowBuildingForm] = useState(false);

  const [buildingForm, setBuildingForm] = useState({
    buildingId: "",
    buildingName: "",
    ownerName: "",
    address: "",
    buildingType: "Residential",
    floors: "",
    contact: ""
  });

  // ======================================================
  // INSPECTION FORM
  // ======================================================

  const [showInspectionForm, setShowInspectionForm] =
    useState(false);

  const [inspectionForm, setInspectionForm] = useState({
    inspectionId: "",
    buildingId: "",
    inspectorId: "",
    inspectionDate: "",
    fireExtinguishers: "PASS",
    emergencyExits: "PASS",
    fireAlarms: "PASS",
    sprinklers: "PASS",
    emergencyLighting: "PASS",
    fireDoors: "PASS",
    overallResult: "PASS",
    remarks: ""
  });

  // ======================================================
  // VIOLATION FORM
  // ======================================================

  const [showViolationForm, setShowViolationForm] =
    useState(false);

  const [violationForm, setViolationForm] = useState({
    violationId: "",
    inspectionId: "",
    buildingId: "",
    violationType: "",
    description: "",
    severity: "MEDIUM",
    status: "OPEN"
  });

  // ======================================================
  // CORRECTIVE ACTION FORM
  // ======================================================

  const [
    showCorrectiveActionForm,
    setShowCorrectiveActionForm
  ] = useState(false);

  const [
    correctiveActionForm,
    setCorrectiveActionForm
  ] = useState({
    actionId: "",
    violationId: "",
    buildingId: "",
    actionDescription: "",
    responsiblePerson: "",
    completionDate: "",
    status: "PENDING"
  });

  // ======================================================
  // RE-INSPECTION FORM
  // ======================================================

  const [
    showReinspectionForm,
    setShowReinspectionForm
  ] = useState(false);

  const [
    reinspectionForm,
    setReinspectionForm
  ] = useState({
    reinspectionId: "",
    buildingId: "",
    violationId: "",
    inspectorId: "",
    reinspectionDate: "",
    correctiveActionVerified: "YES",
    result: "PASS",
    remarks: ""
  });

  // ======================================================
  // CERTIFICATE FORM
  // ======================================================

  const [
    showCertificateForm,
    setShowCertificateForm
  ] = useState(false);

  const [
    certificateForm,
    setCertificateForm
  ] = useState({
    certificateId: "",
    buildingId: "",
    reinspectionId: "",
    issueDate: "",
    expiryDate: "",
    status: "ACTIVE",
    remarks: ""
  });

  // ======================================================
  // LOAD DATA WHEN APP STARTS
  // ======================================================

  useEffect(() => {
    loadData();
  }, []);

  // ======================================================
  // LOAD DATA
  // ======================================================

  const loadData = async () => {
    setLoading(true);

    // Backend status
    try {
      const response = await fetch(
        `${API}/api/test`
      );

      if (response.ok) {
        setApiStatus("Connected");
      } else {
        setApiStatus("Error");
      }
    } catch (error) {
      console.error(
        "Backend connection error:",
        error
      );

      setApiStatus("Offline");
    }

    // Buildings
    try {
      const response = await fetch(
        `${API}/api/buildings`
      );

      const data = await response.json();

      if (response.ok) {
        setBuildings(
          data.buildings || []
        );
      }
    } catch (error) {
      console.error(
        "Buildings error:",
        error
      );
    }

    // Inspections
    try {
      const response = await fetch(
        `${API}/api/inspections`
      );

      const data = await response.json();

      if (response.ok) {
        setInspections(
          data.inspections || []
        );
      }
    } catch (error) {
      console.error(
        "Inspections error:",
        error
      );
    }

    // Violations
    try {
      const response = await fetch(
        `${API}/api/violations`
      );

      const data = await response.json();

      if (response.ok) {
        setViolations(
          data.violations || []
        );
      }
    } catch (error) {
      console.error(
        "Violations error:",
        error
      );
    }

    // Corrective Actions
    try {
      const response = await fetch(
        `${API}/api/corrective-actions`
      );

      const data = await response.json();

      if (response.ok) {
        setCorrectiveActions(
          data.correctiveActions || []
        );
      }
    } catch (error) {
      console.error(
        "Corrective actions error:",
        error
      );
    }

    // Re-inspections
    try {
      const response = await fetch(
        `${API}/api/reinspections`
      );

      const data = await response.json();

      if (response.ok) {
        setReinspections(
          data.reinspections || []
        );
      }
    } catch (error) {
      console.error(
        "Re-inspections error:",
        error
      );
    }

    // Certificates
    try {
      const response = await fetch(
        `${API}/api/certificates`
      );

      const data = await response.json();

      if (response.ok) {
        setCertificates(
          data.certificates || []
        );
      }
    } catch (error) {
      console.error(
        "Certificates error:",
        error
      );
    }

    setLoading(false);
  };

  // ======================================================
  // ACTIVE CERTIFICATES
  // ======================================================

  const activeCertificates =
    certificates.filter(
      (certificate) =>
        certificate.status === "ACTIVE"
    );

  // ======================================================
  // BUILDING FORM HANDLER
  // ======================================================

  const handleBuildingChange = (event) => {
    const { name, value } = event.target;

    setBuildingForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ======================================================
  // INSPECTION FORM HANDLER
  // ======================================================

  const handleInspectionChange = (event) => {
    const { name, value } = event.target;

    setInspectionForm((previous) => {
      const updatedForm = {
        ...previous,
        [name]: value
      };

      const safetyChecks = [
        updatedForm.fireExtinguishers,
        updatedForm.emergencyExits,
        updatedForm.fireAlarms,
        updatedForm.sprinklers,
        updatedForm.emergencyLighting,
        updatedForm.fireDoors
      ];

      // Overall Result is automatic:
      // if any safety check fails, the overall result is FAIL.
      updatedForm.overallResult = safetyChecks.includes("FAIL")
        ? "FAIL"
        : "PASS";

      return updatedForm;
    });
  };

  // ======================================================
  // VIOLATION FORM HANDLER
  // ======================================================

  const handleViolationChange = (event) => {
    const { name, value } = event.target;

    setViolationForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ======================================================
  // CORRECTIVE ACTION FORM HANDLER
  // ======================================================

  const handleCorrectiveActionChange = (event) => {
    const { name, value } = event.target;

    setCorrectiveActionForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ======================================================
  // RE-INSPECTION FORM HANDLER
  // ======================================================

  const handleReinspectionChange = (event) => {
    const { name, value } = event.target;

    setReinspectionForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ======================================================
  // CERTIFICATE FORM HANDLER
  // ======================================================

  const handleCertificateChange = (event) => {
    const { name, value } = event.target;

    setCertificateForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ======================================================
  // REGISTER BUILDING
  // ======================================================

  const registerBuilding = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API}/api/buildings`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            buildingId:
              buildingForm.buildingId.trim(),

            buildingName:
              buildingForm.buildingName.trim(),

            ownerName:
              buildingForm.ownerName.trim(),

            address:
              buildingForm.address.trim(),

            buildingType:
              buildingForm.buildingType,

            floors:
              Number(buildingForm.floors),

            contact:
              buildingForm.contact.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          "Failed to register building"
        );

        return;
      }

      alert(
        "Building registered successfully."
      );

      setBuildings((previous) => [
        data.building,
        ...previous
      ]);

      setBuildingForm({
        buildingId: "",
        buildingName: "",
        ownerName: "",
        address: "",
        buildingType: "Residential",
        floors: "",
        contact: ""
      });

      setShowBuildingForm(false);

    } catch (error) {
      console.error(
        "Register building error:",
        error
      );

      alert(
        "Could not connect to the backend."
      );
    }
  };

  // ======================================================
  // REGISTER INSPECTION
  // ======================================================

  const registerInspection = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API}/api/inspections`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            inspectionId:
              inspectionForm.inspectionId.trim(),

            buildingId:
              inspectionForm.buildingId,

            inspectorId:
              inspectionForm.inspectorId.trim(),

            inspectionDate:
              inspectionForm.inspectionDate,

            fireExtinguishers:
              inspectionForm.fireExtinguishers === "PASS",

            emergencyExits:
              inspectionForm.emergencyExits === "PASS",

            fireAlarms:
              inspectionForm.fireAlarms === "PASS",

            sprinklers:
              inspectionForm.sprinklers === "PASS",

            emergencyLighting:
              inspectionForm.emergencyLighting === "PASS",

            fireDoors:
              inspectionForm.fireDoors === "PASS",

            overallResult:
              inspectionForm.overallResult,

            remarks:
              inspectionForm.remarks.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          "Failed to record inspection"
        );

        return;
      }

      alert(
        "Inspection recorded successfully."
      );

      setInspections((previous) => [
        data.inspection,
        ...previous
      ]);

      setInspectionForm({
        inspectionId: "",
        buildingId: "",
        inspectorId: "",
        inspectionDate: "",
        fireExtinguishers: "PASS",
        emergencyExits: "PASS",
        fireAlarms: "PASS",
        sprinklers: "PASS",
        emergencyLighting: "PASS",
        fireDoors: "PASS",
        overallResult: "PASS",
        remarks: ""
      });

      setShowInspectionForm(false);

    } catch (error) {
      console.error(
        "Register inspection error:",
        error
      );

      alert(
        "Could not connect to the backend."
      );
    }
  };

  // ======================================================
  // REGISTER VIOLATION
  // ======================================================

  const registerViolation = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API}/api/violations`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            violationId:
              violationForm.violationId.trim(),

            inspectionId:
              violationForm.inspectionId.trim(),

            buildingId:
              violationForm.buildingId,

            violationType:
              violationForm.violationType.trim(),

            description:
              violationForm.description.trim(),

            severity:
              violationForm.severity,

            status:
              violationForm.status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          "Failed to record violation"
        );

        return;
      }

      alert(
        "Violation recorded successfully."
      );

      setViolations((previous) => [
        data.violation,
        ...previous
      ]);

      setViolationForm({
        violationId: "",
        inspectionId: "",
        buildingId: "",
        violationType: "",
        description: "",
        severity: "MEDIUM",
        status: "OPEN"
      });

      setShowViolationForm(false);

    } catch (error) {
      console.error(
        "Register violation error:",
        error
      );

      alert(
        "Could not connect to the backend."
      );
    }
  };

  // ======================================================
  // REGISTER CORRECTIVE ACTION
  // ======================================================

  const registerCorrectiveAction = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API}/api/corrective-actions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            actionId:
              correctiveActionForm.actionId.trim(),

            violationId:
              correctiveActionForm.violationId.trim(),

            buildingId:
              correctiveActionForm.buildingId,

            actionDescription:
              correctiveActionForm.actionDescription.trim(),

            responsiblePerson:
              correctiveActionForm.responsiblePerson.trim(),

            completionDate:
              correctiveActionForm.completionDate ||
              null,

            status:
              correctiveActionForm.status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          "Failed to record corrective action"
        );

        return;
      }

      alert(
        "Corrective action recorded successfully."
      );

      setCorrectiveActions((previous) => [
        data.correctiveAction,
        ...previous
      ]);

      setCorrectiveActionForm({
        actionId: "",
        violationId: "",
        buildingId: "",
        actionDescription: "",
        responsiblePerson: "",
        completionDate: "",
        status: "PENDING"
      });

      setShowCorrectiveActionForm(false);

    } catch (error) {
      console.error(
        "Register corrective action error:",
        error
      );

      alert(
        "Could not connect to the backend."
      );
    }
  };

  // ======================================================
  // REGISTER RE-INSPECTION
  // ======================================================

  const registerReinspection = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API}/api/reinspections`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            reinspectionId:
              reinspectionForm.reinspectionId.trim(),

            buildingId:
              reinspectionForm.buildingId,

            violationId:
              reinspectionForm.violationId,

            inspectorId:
              reinspectionForm.inspectorId.trim(),

            reinspectionDate:
              reinspectionForm.reinspectionDate,

            correctiveActionVerified:
              reinspectionForm.correctiveActionVerified ===
              "YES",

            result:
              reinspectionForm.result,

            remarks:
              reinspectionForm.remarks.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          "Failed to record re-inspection"
        );

        return;
      }

      alert(
        "Re-inspection recorded successfully."
      );

      setReinspections((previous) => [
        data.reinspection,
        ...previous
      ]);

      setReinspectionForm({
        reinspectionId: "",
        buildingId: "",
        violationId: "",
        inspectorId: "",
        reinspectionDate: "",
        correctiveActionVerified: "YES",
        result: "PASS",
        remarks: ""
      });

      setShowReinspectionForm(false);

    } catch (error) {
      console.error(
        "Register re-inspection error:",
        error
      );

      alert(
        "Could not connect to the backend."
      );
    }
  };

  // ======================================================
  // REGISTER CERTIFICATE
  // ======================================================

  const registerCertificate = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API}/api/certificates`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            certificateId:
              certificateForm.certificateId.trim(),

            buildingId:
              certificateForm.buildingId,

            reinspectionId:
              certificateForm.reinspectionId,

            issueDate:
              certificateForm.issueDate,

            expiryDate:
              certificateForm.expiryDate,

            status:
              certificateForm.status,

            remarks:
              certificateForm.remarks.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          "Failed to issue certificate"
        );

        return;
      }

      alert(
        "Certificate issued successfully."
      );

      setCertificates((previous) => [
        data.certificate,
        ...previous
      ]);

      setCertificateForm({
        certificateId: "",
        buildingId: "",
        reinspectionId: "",
        issueDate: "",
        expiryDate: "",
        status: "ACTIVE",
        remarks: ""
      });

      setShowCertificateForm(false);

    } catch (error) {
      console.error(
        "Register certificate error:",
        error
      );

      alert(
        "Could not connect to the backend."
      );
    }
  };

  // ======================================================
  // BLOCKCHAIN FUNCTIONS
  // ======================================================

  const readBlockchainRecord = async () => {
    const recordId = blockchainRecordId.trim();

    if (!recordId) {
      setBlockchainError("Please enter a record ID.");
      setBlockchainRecord(null);
      setVerificationResult(null);
      return;
    }

    setBlockchainLoading(true);
    setBlockchainError("");
    setBlockchainRecord(null);
    setVerificationResult(null);

    try {
      const provider = new ethers.JsonRpcProvider(
        BLOCKCHAIN_RPC
      );

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const record = await contract.getRecord(recordId);

      if (!record[0]) {
        setBlockchainError(
          `No blockchain record found for ${recordId}.`
        );
        return;
      }

      setBlockchainRecord({
        recordId: record[0],
        buildingId: record[1],
        recordType: record[2],
        status: record[3],
        dataHash: record[4],
        timestamp: record[5].toString(),
        recordedBy: record[6]
      });
    } catch (error) {
      console.error(
        "Blockchain read error:",
        error
      );

      setBlockchainError(
        "Could not connect to the Hardhat blockchain. Make sure the Hardhat node is running."
      );
    } finally {
      setBlockchainLoading(false);
    }
  };

  const verifyBlockchainRecord = async () => {
    if (!blockchainRecord) {
      setVerificationResult({
        success: false,
        message: "Read a blockchain record first."
      });
      return;
    }

    const hash = verifyHash.trim();

    if (!hash) {
      setVerificationResult({
        success: false,
        message: "Please enter a data hash to verify."
      });
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider(
        BLOCKCHAIN_RPC
      );

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const verified = await contract.verifyRecord(
        blockchainRecord.recordId,
        hash
      );

      setVerificationResult({
        success: verified,
        message: verified
          ? "Hash matches the blockchain record."
          : "Hash does not match the blockchain record."
      });
    } catch (error) {
      console.error(
        "Blockchain verification error:",
        error
      );

      setVerificationResult({
        success: false,
        message: "Blockchain verification failed."
      });
    }
  };

  const formatBlockchainTimestamp = (timestamp) => {
    const numericTimestamp = Number(timestamp);

    if (!Number.isFinite(numericTimestamp)) {
      return timestamp;
    }

    return new Date(
      numericTimestamp * 1000
    ).toLocaleString();
  };

  // ======================================================
  // DASHBOARD
  // ======================================================

  const renderDashboard = () => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              Fire Safety Dashboard
            </h1>

            <p>
              Monitor inspections, compliance,
              violations and blockchain records.
            </p>

          </div>

          <div className="backend-status">

            <span
              className={
                apiStatus === "Connected"
                  ? "status-dot online"
                  : "status-dot"
              }
            ></span>

            Backend: {apiStatus}

          </div>

        </header>

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              🏢
            </div>

            <div>

              <p>
                Total Buildings
              </p>

              <h2>
                {buildings.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              🔍
            </div>

            <div>

              <p>
                Inspections
              </p>

              <h2>
                {inspections.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ⚠️
            </div>

            <div>

              <p>
                Violations
              </p>

              <h2>
                {violations.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              📜
            </div>

            <div>

              <p>
                Active Certificates
              </p>

              <h2>
                {activeCertificates.length}
              </h2>

            </div>

          </div>

        </section>

        <section className="content-grid">

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Compliance Workflow
                </h2>

                <p>
                  Current fire-safety process
                </p>

              </div>

            </div>

            <div className="workflow">

              <div className="workflow-step completed">

                <span>
                  1
                </span>

                <div>

                  <strong>
                    Inspection
                  </strong>

                  <p>
                    {inspections.length}
                    {" "}
                    recorded
                  </p>

                </div>

              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step completed">

                <span>
                  2
                </span>

                <div>

                  <strong>
                    Violation
                  </strong>

                  <p>
                    {violations.length}
                    {" "}
                    recorded
                  </p>

                </div>

              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step completed">

                <span>
                  3
                </span>

                <div>

                  <strong>
                    Corrective Action
                  </strong>

                  <p>
                    {correctiveActions.length}
                    {" "}
                    recorded
                  </p>

                </div>

              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step completed">

                <span>
                  4
                </span>

                <div>

                  <strong>
                    Re-inspection
                  </strong>

                  <p>
                    {reinspections.length}
                    {" "}
                    recorded
                  </p>

                </div>

              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step completed">

                <span>
                  5
                </span>

                <div>

                  <strong>
                    Certificate
                  </strong>

                  <p>
                    {activeCertificates.length}
                    {" "}
                    active
                  </p>

                </div>

              </div>

            </div>

          </div>

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Blockchain Status
                </h2>

                <p>
                  Smart contract connection
                </p>

              </div>

              <span className="badge success">
                Connected
              </span>

            </div>

            <div className="blockchain-info">

              <div>

                <span>
                  Network
                </span>

                <strong>
                  Hardhat Local
                </strong>

              </div>

              <div>

                <span>
                  RPC
                </span>

                <strong>
                  127.0.0.1:8545
                </strong>

              </div>

              <div>

                <span>
                  Contract
                </span>

                <strong className="contract-address">
                  0x5FbDB231...180aa3
                </strong>

              </div>

            </div>

          </div>

        </section>

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Registered Buildings
              </h2>

              <p>
                Buildings stored in MongoDB Atlas
              </p>

            </div>

          </div>

          {buildings.length === 0 ? (

            <div className="empty-state">
              No buildings registered yet.
            </div>

          ) : (

            <div className="building-list">

              {buildings.map(
                (building) => (

                  <div
                    className="building-row"
                    key={building._id}
                  >

                    <div>

                      <strong>
                        {building.buildingId}
                      </strong>

                      <p>
                        {building.buildingName}
                      </p>

                      <small>
                        Type:{" "}
                        {building.buildingType ||
                          "Not specified"}
                      </small>

                    </div>

                    <span className="badge success">
                      Registered
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>
      </>
    );
  };

  // ======================================================
  // BUILDINGS PAGE
  // ======================================================

  const renderBuildings = () => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              Buildings
            </h1>

            <p>
              Manage buildings registered in
              the fire safety system.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowBuildingForm(
                !showBuildingForm
              )
            }
          >
            {showBuildingForm
              ? "Close Form"
              : "+ Register Building"}
          </button>

        </header>

        {showBuildingForm && (

          <section className="panel form-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Register New Building
                </h2>

                <p>
                  Add building information to
                  MongoDB Atlas.
                </p>

              </div>

            </div>

            <form
              className="building-form"
              onSubmit={registerBuilding}
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Building ID
                  </label>

                  <input
                    type="text"
                    name="buildingId"
                    value={
                      buildingForm.buildingId
                    }
                    onChange={
                      handleBuildingChange
                    }
                    placeholder="B002"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Building Name
                  </label>

                  <input
                    type="text"
                    name="buildingName"
                    value={
                      buildingForm.buildingName
                    }
                    onChange={
                      handleBuildingChange
                    }
                    placeholder="Sunrise Apartments"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Owner Name
                  </label>

                  <input
                    type="text"
                    name="ownerName"
                    value={
                      buildingForm.ownerName
                    }
                    onChange={
                      handleBuildingChange
                    }
                    placeholder="Owner name"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      buildingForm.address
                    }
                    onChange={
                      handleBuildingChange
                    }
                    placeholder="Vijayawada"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Building Type
                  </label>

                  <select
                    name="buildingType"
                    value={
                      buildingForm.buildingType
                    }
                    onChange={
                      handleBuildingChange
                    }
                    required
                  >

                    <option value="Residential">
                      Residential
                    </option>

                    <option value="Commercial">
                      Commercial
                    </option>

                    <option value="Industrial">
                      Industrial
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Floors
                  </label>

                  <input
                    type="number"
                    name="floors"
                    value={
                      buildingForm.floors
                    }
                    onChange={
                      handleBuildingChange
                    }
                    min="1"
                    placeholder="5"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Contact
                  </label>

                  <input
                    type="text"
                    name="contact"
                    value={
                      buildingForm.contact
                    }
                    onChange={
                      handleBuildingChange
                    }
                    placeholder="9876543210"
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="primary-button"
              >
                Save Building
              </button>

            </form>

          </section>
        )}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                All Registered Buildings
              </h2>

              <p>
                {buildings.length}
                {" "}
                building(s) found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading buildings...
            </div>

          ) : buildings.length === 0 ? (

            <div className="empty-state">
              No buildings registered.
            </div>

          ) : (

            <div className="building-list">

              {buildings.map(
                (building) => (

                  <div
                    className="building-row"
                    key={building._id}
                  >

                    <div>

                      <strong>
                        {building.buildingId}
                      </strong>

                      <p>
                        {building.buildingName}
                      </p>

                      <small>
                        Owner:{" "}
                        {building.ownerName}
                        {" | "}
                        Address:{" "}
                        {building.address}
                        {" | "}
                        Type:{" "}
                        {building.buildingType ||
                          "Not specified"}
                        {" | "}
                        Floors:{" "}
                        {building.floors}
                        {" | "}
                        Contact:{" "}
                        {building.contact}
                      </small>

                    </div>

                    <span className="badge success">
                      Registered
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>
      </>
    );
  };

  // ======================================================
  // INSPECTIONS PAGE
  // ======================================================

  const renderInspections = () => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              Inspections
            </h1>

            <p>
              Record fire-safety inspections
              for registered buildings.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowInspectionForm(
                !showInspectionForm
              )
            }
          >
            {showInspectionForm
              ? "Close Form"
              : "+ New Inspection"}
          </button>

        </header>

        {showInspectionForm && (

          <section className="panel form-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Record New Inspection
                </h2>

                <p>
                  Save inspection details to
                  MongoDB and blockchain.
                </p>

              </div>

            </div>

            <form
              className="building-form"
              onSubmit={registerInspection}
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Inspection ID
                  </label>

                  <input
                    type="text"
                    name="inspectionId"
                    value={
                      inspectionForm.inspectionId
                    }
                    onChange={
                      handleInspectionChange
                    }
                    placeholder="INS007"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Building
                  </label>

                  <select
                    name="buildingId"
                    value={
                      inspectionForm.buildingId
                    }
                    onChange={
                      handleInspectionChange
                    }
                    required
                  >

                    <option value="">
                      Select Building
                    </option>

                    {buildings.map(
                      (building) => (

                        <option
                          key={building._id}
                          value={
                            building.buildingId
                          }
                        >
                          {building.buildingId}
                          {" - "}
                          {building.buildingName}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Inspector ID
                  </label>

                  <input
                    type="text"
                    name="inspectorId"
                    value={
                      inspectionForm.inspectorId
                    }
                    onChange={
                      handleInspectionChange
                    }
                    placeholder="I107"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Inspection Date
                  </label>

                  <input
                    type="date"
                    name="inspectionDate"
                    value={
                      inspectionForm.inspectionDate
                    }
                    onChange={
                      handleInspectionChange
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Fire Extinguishers
                  </label>

                  <select
                    name="fireExtinguishers"
                    value={
                      inspectionForm.fireExtinguishers
                    }
                    onChange={
                      handleInspectionChange
                    }
                  >

                    <option value="PASS">
                      PASS
                    </option>

                    <option value="FAIL">
                      FAIL
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Emergency Exits
                  </label>

                  <select
                    name="emergencyExits"
                    value={
                      inspectionForm.emergencyExits
                    }
                    onChange={
                      handleInspectionChange
                    }
                  >

                    <option value="PASS">
                      PASS
                    </option>

                    <option value="FAIL">
                      FAIL
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Fire Alarms
                  </label>

                  <select
                    name="fireAlarms"
                    value={
                      inspectionForm.fireAlarms
                    }
                    onChange={
                      handleInspectionChange
                    }
                  >

                    <option value="PASS">
                      PASS
                    </option>

                    <option value="FAIL">
                      FAIL
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Sprinklers
                  </label>

                  <select
                    name="sprinklers"
                    value={
                      inspectionForm.sprinklers
                    }
                    onChange={
                      handleInspectionChange
                    }
                  >

                    <option value="PASS">
                      PASS
                    </option>

                    <option value="FAIL">
                      FAIL
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Emergency Lighting
                  </label>

                  <select
                    name="emergencyLighting"
                    value={
                      inspectionForm.emergencyLighting
                    }
                    onChange={
                      handleInspectionChange
                    }
                  >

                    <option value="PASS">
                      PASS
                    </option>

                    <option value="FAIL">
                      FAIL
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Fire Doors
                  </label>

                  <select
                    name="fireDoors"
                    value={
                      inspectionForm.fireDoors
                    }
                    onChange={
                      handleInspectionChange
                    }
                  >

                    <option value="PASS">
                      PASS
                    </option>

                    <option value="FAIL">
                      FAIL
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Overall Result (Automatic)
                  </label>

                  <select
                    value={
                      inspectionForm.overallResult
                    }
                    disabled
                  >

                    <option value="PASS">
                      PASS
                    </option>

                    <option value="FAIL">
                      FAIL
                    </option>

                  </select>

                  <small>
                    Automatically set to FAIL if any safety check is FAIL.
                  </small>

                </div>

                <div className="form-group">

                  <label>
                    Remarks
                  </label>

                  <input
                    type="text"
                    name="remarks"
                    value={
                      inspectionForm.remarks
                    }
                    onChange={
                      handleInspectionChange
                    }
                    placeholder="Enter inspection remarks"
                  />

                </div>

              </div>

              <button
                type="submit"
                className="primary-button"
              >
                Save Inspection
              </button>

            </form>

          </section>
        )}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Inspection Records
              </h2>

              <p>
                {inspections.length}
                {" "}
                inspection(s) found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading inspections...
            </div>

          ) : inspections.length === 0 ? (

            <div className="empty-state">
              No inspections recorded.
            </div>

          ) : (

            <div className="building-list">

              {inspections.map(
                (inspection) => (

                  <div
                    className="building-row"
                    key={inspection._id}
                  >

                    <div>

                      <strong>
                        {inspection.inspectionId}
                      </strong>

                      <p>
                        Building:{" "}
                        {inspection.buildingId}
                        {" | "}
                        Inspector:{" "}
                        {inspection.inspectorId}
                      </p>

                      <small>
                        Date:{" "}
                        {inspection.inspectionDate}
                        {" | "}
                        Result:{" "}
                        {inspection.overallResult}
                        {" | "}
                        Remarks:{" "}
                        {inspection.remarks ||
                          "None"}
                      </small>

                    </div>

                    <span className="badge success">
                      {inspection.overallResult}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>
      </>
    );
  };

  // ======================================================
  // VIOLATIONS PAGE
  // ======================================================

  const renderViolations = () => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              Violations
            </h1>

            <p>
              Record fire-safety violations
              identified during inspections.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowViolationForm(
                !showViolationForm
              )
            }
          >
            {showViolationForm
              ? "Close Form"
              : "+ New Violation"}
          </button>

        </header>

        {showViolationForm && (

          <section className="panel form-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Record New Violation
                </h2>

                <p>
                  Save violation details to
                  MongoDB and blockchain.
                </p>

              </div>

            </div>

            <form
              className="building-form"
              onSubmit={registerViolation}
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Violation ID
                  </label>

                  <input
                    type="text"
                    name="violationId"
                    value={
                      violationForm.violationId
                    }
                    onChange={
                      handleViolationChange
                    }
                    placeholder="V005"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Inspection ID
                  </label>

                  <select
                    name="inspectionId"
                    value={
                      violationForm.inspectionId
                    }
                    onChange={
                      handleViolationChange
                    }
                    required
                  >

                    <option value="">
                      Select Inspection
                    </option>

                    {inspections.map(
                      (inspection) => (

                        <option
                          key={inspection._id}
                          value={
                            inspection.inspectionId
                          }
                        >
                          {inspection.inspectionId}
                          {" - "}
                          {inspection.buildingId}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Building ID
                  </label>

                  <select
                    name="buildingId"
                    value={
                      violationForm.buildingId
                    }
                    onChange={
                      handleViolationChange
                    }
                    required
                  >

                    <option value="">
                      Select Building
                    </option>

                    {buildings.map(
                      (building) => (

                        <option
                          key={building._id}
                          value={
                            building.buildingId
                          }
                        >
                          {building.buildingId}
                          {" - "}
                          {building.buildingName}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Violation Type
                  </label>

                  <input
                    type="text"
                    name="violationType"
                    value={
                      violationForm.violationType
                    }
                    onChange={
                      handleViolationChange
                    }
                    placeholder="Fire Alarm Failure"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Severity
                  </label>

                  <select
                    name="severity"
                    value={
                      violationForm.severity
                    }
                    onChange={
                      handleViolationChange
                    }
                    required
                  >

                    <option value="LOW">
                      LOW
                    </option>

                    <option value="MEDIUM">
                      MEDIUM
                    </option>

                    <option value="HIGH">
                      HIGH
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      violationForm.status
                    }
                    onChange={
                      handleViolationChange
                    }
                    required
                  >

                    <option value="OPEN">
                      OPEN
                    </option>

                    <option value="RESOLVED">
                      RESOLVED
                    </option>

                  </select>

                </div>

                <div
                  className="form-group"
                  style={{
                    gridColumn: "1 / -1"
                  }}
                >

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      violationForm.description
                    }
                    onChange={
                      handleViolationChange
                    }
                    placeholder="Describe the fire-safety violation"
                    rows="4"
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="primary-button"
              >
                Save Violation
              </button>

            </form>

          </section>
        )}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Violation Records
              </h2>

              <p>
                {violations.length}
                {" "}
                violation(s) found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading violations...
            </div>

          ) : violations.length === 0 ? (

            <div className="empty-state">
              No violations recorded.
            </div>

          ) : (

            <div className="building-list">

              {violations.map(
                (violation) => (

                  <div
                    className="building-row"
                    key={violation._id}
                  >

                    <div>

                      <strong>
                        {violation.violationId}
                      </strong>

                      <p>
                        Inspection:{" "}
                        {violation.inspectionId}
                        {" | "}
                        Building:{" "}
                        {violation.buildingId}
                      </p>

                      <small>
                        Type:{" "}
                        {violation.violationType}
                        {" | "}
                        Severity:{" "}
                        {violation.severity}
                        {" | "}
                        Status:{" "}
                        {violation.status}
                        {" | "}
                        Description:{" "}
                        {violation.description}
                      </small>

                    </div>

                    <span className="badge success">
                      {violation.status}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>
      </>
    );
  };

  // ======================================================
  // CORRECTIVE ACTIONS PAGE
  // ======================================================

  const renderCorrectiveActions = () => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              Corrective Actions
            </h1>

            <p>
              Manage actions taken to resolve
              fire-safety violations.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowCorrectiveActionForm(
                !showCorrectiveActionForm
              )
            }
          >
            {showCorrectiveActionForm
              ? "Close Form"
              : "+ New Corrective Action"}
          </button>

        </header>

        {showCorrectiveActionForm && (

          <section className="panel form-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Record New Corrective Action
                </h2>

                <p>
                  Link a corrective action to
                  an existing violation.
                </p>

              </div>

            </div>

            <form
              className="building-form"
              onSubmit={
                registerCorrectiveAction
              }
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Action ID
                  </label>

                  <input
                    type="text"
                    name="actionId"
                    value={
                      correctiveActionForm.actionId
                    }
                    onChange={
                      handleCorrectiveActionChange
                    }
                    placeholder="CA004"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Violation ID
                  </label>

                  <select
                    name="violationId"
                    value={
                      correctiveActionForm.violationId
                    }
                    onChange={
                      handleCorrectiveActionChange
                    }
                    required
                  >

                    <option value="">
                      Select Violation
                    </option>

                    {violations.map(
                      (violation) => (

                        <option
                          key={violation._id}
                          value={
                            violation.violationId
                          }
                        >
                          {violation.violationId}
                          {" - "}
                          {violation.buildingId}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Building ID
                  </label>

                  <select
                    name="buildingId"
                    value={
                      correctiveActionForm.buildingId
                    }
                    onChange={
                      handleCorrectiveActionChange
                    }
                    required
                  >

                    <option value="">
                      Select Building
                    </option>

                    {buildings.map(
                      (building) => (

                        <option
                          key={building._id}
                          value={
                            building.buildingId
                          }
                        >
                          {building.buildingId}
                          {" - "}
                          {building.buildingName}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Responsible Person
                  </label>

                  <input
                    type="text"
                    name="responsiblePerson"
                    value={
                      correctiveActionForm.responsiblePerson
                    }
                    onChange={
                      handleCorrectiveActionChange
                    }
                    placeholder="Responsible person"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Completion Date
                  </label>

                  <input
                    type="date"
                    name="completionDate"
                    value={
                      correctiveActionForm.completionDate
                    }
                    onChange={
                      handleCorrectiveActionChange
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      correctiveActionForm.status
                    }
                    onChange={
                      handleCorrectiveActionChange
                    }
                    required
                  >

                    <option value="PENDING">
                      PENDING
                    </option>

                    <option value="COMPLETED">
                      COMPLETED
                    </option>

                  </select>

                </div>

                <div
                  className="form-group"
                  style={{
                    gridColumn: "1 / -1"
                  }}
                >

                  <label>
                    Action Description
                  </label>

                  <textarea
                    name="actionDescription"
                    value={
                      correctiveActionForm.actionDescription
                    }
                    onChange={
                      handleCorrectiveActionChange
                    }
                    placeholder="Describe the corrective action"
                    rows="4"
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="primary-button"
              >
                Save Corrective Action
              </button>

            </form>

          </section>
        )}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Corrective Action Records
              </h2>

              <p>
                {correctiveActions.length}
                {" "}
                corrective action(s) found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading corrective actions...
            </div>

          ) : correctiveActions.length === 0 ? (

            <div className="empty-state">
              No corrective actions recorded.
            </div>

          ) : (

            <div className="building-list">

              {correctiveActions.map(
                (action) => (

                  <div
                    className="building-row"
                    key={action._id}
                  >

                    <div>

                      <strong>
                        {action.actionId}
                      </strong>

                      <p>
                        Violation:{" "}
                        {action.violationId}
                        {" | "}
                        Building:{" "}
                        {action.buildingId}
                      </p>

                      <small>
                        Action:{" "}
                        {action.actionDescription}
                        {" | "}
                        Responsible:{" "}
                        {action.responsiblePerson}
                        {" | "}
                        Completion Date:{" "}
                        {action.completionDate
                          ? action.completionDate
                          : "Not set"}
                        {" | "}
                        Status:{" "}
                        {action.status}
                      </small>

                    </div>

                    <span className="badge success">
                      {action.status}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>
      </>
    );
  };

  // ======================================================
  // RE-INSPECTIONS PAGE
  // ======================================================

  const renderReinspections = () => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              Re-inspections
            </h1>

            <p>
              Verify corrective actions and
              re-check fire-safety compliance.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowReinspectionForm(
                !showReinspectionForm
              )
            }
          >
            {showReinspectionForm
              ? "Close Form"
              : "+ New Re-inspection"}
          </button>

        </header>

        {showReinspectionForm && (

          <section className="panel form-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Record New Re-inspection
                </h2>

                <p>
                  Verify whether the corrective
                  action resolved the violation.
                </p>

              </div>

            </div>

            <form
              className="building-form"
              onSubmit={
                registerReinspection
              }
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Re-inspection ID
                  </label>

                  <input
                    type="text"
                    name="reinspectionId"
                    value={
                      reinspectionForm.reinspectionId
                    }
                    onChange={
                      handleReinspectionChange
                    }
                    placeholder="REINS003"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Building ID
                  </label>

                  <select
                    name="buildingId"
                    value={
                      reinspectionForm.buildingId
                    }
                    onChange={
                      handleReinspectionChange
                    }
                    required
                  >

                    <option value="">
                      Select Building
                    </option>

                    {buildings.map(
                      (building) => (

                        <option
                          key={building._id}
                          value={
                            building.buildingId
                          }
                        >
                          {building.buildingId}
                          {" - "}
                          {building.buildingName}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Violation ID
                  </label>

                  <select
                    name="violationId"
                    value={
                      reinspectionForm.violationId
                    }
                    onChange={
                      handleReinspectionChange
                    }
                    required
                  >

                    <option value="">
                      Select Violation
                    </option>

                    {violations.map(
                      (violation) => (

                        <option
                          key={violation._id}
                          value={
                            violation.violationId
                          }
                        >
                          {violation.violationId}
                          {" - "}
                          {violation.buildingId}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Inspector ID
                  </label>

                  <input
                    type="text"
                    name="inspectorId"
                    value={
                      reinspectionForm.inspectorId
                    }
                    onChange={
                      handleReinspectionChange
                    }
                    placeholder="I106"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Re-inspection Date
                  </label>

                  <input
                    type="date"
                    name="reinspectionDate"
                    value={
                      reinspectionForm.reinspectionDate
                    }
                    onChange={
                      handleReinspectionChange
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Corrective Action Verified
                  </label>

                  <select
                    name="correctiveActionVerified"
                    value={
                      reinspectionForm
                        .correctiveActionVerified
                    }
                    onChange={
                      handleReinspectionChange
                    }
                    required
                  >

                    <option value="YES">
                      YES
                    </option>

                    <option value="NO">
                      NO
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Result
                  </label>

                  <select
                    name="result"
                    value={
                      reinspectionForm.result
                    }
                    onChange={
                      handleReinspectionChange
                    }
                    required
                  >

                    <option value="PASS">
                      PASS
                    </option>

                    <option value="FAIL">
                      FAIL
                    </option>

                  </select>

                </div>

                <div
                  className="form-group"
                  style={{
                    gridColumn: "1 / -1"
                  }}
                >

                  <label>
                    Remarks
                  </label>

                  <textarea
                    name="remarks"
                    value={
                      reinspectionForm.remarks
                    }
                    onChange={
                      handleReinspectionChange
                    }
                    placeholder="Enter re-inspection remarks"
                    rows="4"
                  />

                </div>

              </div>

              <button
                type="submit"
                className="primary-button"
              >
                Save Re-inspection
              </button>

            </form>

          </section>
        )}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Re-inspection Records
              </h2>

              <p>
                {reinspections.length}
                {" "}
                re-inspection(s) found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading re-inspections...
            </div>

          ) : reinspections.length === 0 ? (

            <div className="empty-state">
              No re-inspections recorded.
            </div>

          ) : (

            <div className="building-list">

              {reinspections.map(
                (reinspection) => (

                  <div
                    className="building-row"
                    key={reinspection._id}
                  >

                    <div>

                      <strong>
                        {reinspection.reinspectionId}
                      </strong>

                      <p>
                        Violation:{" "}
                        {reinspection.violationId}
                        {" | "}
                        Building:{" "}
                        {reinspection.buildingId}
                        {" | "}
                        Inspector:{" "}
                        {reinspection.inspectorId}
                      </p>

                      <small>
                        Date:{" "}
                        {reinspection.reinspectionDate}
                        {" | "}
                        Corrective Action Verified:{" "}
                        {reinspection
                          .correctiveActionVerified
                          ? "YES"
                          : "NO"}
                        {" | "}
                        Result:{" "}
                        {reinspection.result}
                        {" | "}
                        Remarks:{" "}
                        {reinspection.remarks ||
                          "None"}
                      </small>

                    </div>

                    <span className="badge success">
                      {reinspection.result}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>
      </>
    );
  };

  // ======================================================
  // CERTIFICATES PAGE
  // ======================================================

  const renderCertificates = () => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              Certificates
            </h1>

            <p>
              Issue and manage fire-safety
              compliance certificates.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowCertificateForm(
                !showCertificateForm
              )
            }
          >
            {showCertificateForm
              ? "Close Form"
              : "+ New Certificate"}
          </button>

        </header>

        {/* Certificate Form */}

        {showCertificateForm && (

          <section className="panel form-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Issue New Certificate
                </h2>

                <p>
                  Create a certificate after
                  successful re-inspection.
                </p>

              </div>

            </div>

            <form
              className="building-form"
              onSubmit={
                registerCertificate
              }
            >

              <div className="form-grid">

                {/* Certificate ID */}

                <div className="form-group">

                  <label>
                    Certificate ID
                  </label>

                  <input
                    type="text"
                    name="certificateId"
                    value={
                      certificateForm.certificateId
                    }
                    onChange={
                      handleCertificateChange
                    }
                    placeholder="CERT003"
                    required
                  />

                </div>

                {/* Building */}

                <div className="form-group">

                  <label>
                    Building ID
                  </label>

                  <select
                    name="buildingId"
                    value={
                      certificateForm.buildingId
                    }
                    onChange={
                      handleCertificateChange
                    }
                    required
                  >

                    <option value="">
                      Select Building
                    </option>

                    {buildings.map(
                      (building) => (

                        <option
                          key={building._id}
                          value={
                            building.buildingId
                          }
                        >
                          {building.buildingId}
                          {" - "}
                          {building.buildingName}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* Re-inspection */}

                <div className="form-group">

                  <label>
                    Re-inspection ID
                  </label>

                  <select
                    name="reinspectionId"
                    value={
                      certificateForm.reinspectionId
                    }
                    onChange={
                      handleCertificateChange
                    }
                    required
                  >

                    <option value="">
                      Select Re-inspection
                    </option>

                    {reinspections.map(
                      (reinspection) => (

                        <option
                          key={reinspection._id}
                          value={
                            reinspection.reinspectionId
                          }
                        >
                          {reinspection.reinspectionId}
                          {" - "}
                          {reinspection.buildingId}
                          {" - "}
                          {reinspection.result}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* Issue Date */}

                <div className="form-group">

                  <label>
                    Issue Date
                  </label>

                  <input
                    type="date"
                    name="issueDate"
                    value={
                      certificateForm.issueDate
                    }
                    onChange={
                      handleCertificateChange
                    }
                    required
                  />

                </div>

                {/* Expiry Date */}

                <div className="form-group">

                  <label>
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={
                      certificateForm.expiryDate
                    }
                    onChange={
                      handleCertificateChange
                    }
                    required
                  />

                </div>

                {/* Status */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      certificateForm.status
                    }
                    onChange={
                      handleCertificateChange
                    }
                    required
                  >

                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="EXPIRED">
                      EXPIRED
                    </option>

                    <option value="REVOKED">
                      REVOKED
                    </option>

                  </select>

                </div>

                {/* Remarks */}

                <div
                  className="form-group"
                  style={{
                    gridColumn: "1 / -1"
                  }}
                >

                  <label>
                    Remarks
                  </label>

                  <textarea
                    name="remarks"
                    value={
                      certificateForm.remarks
                    }
                    onChange={
                      handleCertificateChange
                    }
                    placeholder="Enter certificate remarks"
                    rows="4"
                  />

                </div>

              </div>

              <button
                type="submit"
                className="primary-button"
              >
                Save Certificate
              </button>

            </form>

          </section>
        )}

        {/* Certificate Records */}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Certificate Records
              </h2>

              <p>
                {certificates.length}
                {" "}
                certificate(s) found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading certificates...
            </div>

          ) : certificates.length === 0 ? (

            <div className="empty-state">
              No certificates issued.
            </div>

          ) : (

            <div className="building-list">

              {certificates.map(
                (certificate) => (

                  <div
                    className="building-row"
                    key={certificate._id}
                  >

                    <div>

                      <strong>
                        {certificate.certificateId}
                      </strong>

                      <p>
                        Building:{" "}
                        {certificate.buildingId}
                        {" | "}
                        Re-inspection:{" "}
                        {certificate.reinspectionId}
                      </p>

                      <small>
                        Issue Date:{" "}
                        {certificate.issueDate}
                        {" | "}
                        Expiry Date:{" "}
                        {certificate.expiryDate}
                        {" | "}
                        Status:{" "}
                        {certificate.status}
                        {" | "}
                        Remarks:{" "}
                        {certificate.remarks ||
                          "None"}
                      </small>

                    </div>

                    <span className="badge success">
                      {certificate.status}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>
      </>
    );
  };

  // ======================================================
  // BLOCKCHAIN PAGE
  // ======================================================

  const renderBlockchain = () => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              Blockchain
            </h1>

            <p>
              Read and verify compliance records stored
              on the Hardhat smart contract.
            </p>

          </div>

          <span className="badge success">
            Hardhat Local
          </span>

        </header>

        <section className="panel form-panel">

          <div className="panel-header">

            <div>

              <h2>
                Read Blockchain Record
              </h2>

              <p>
                Enter a record ID such as INS006, V004,
                CA003, REINS003, or CERT003.
              </p>

            </div>

          </div>

          <div className="form-grid">

            <div
              className="form-group"
              style={{ gridColumn: "1 / -1" }}
            >

              <label>
                Record ID
              </label>

              <input
                type="text"
                value={blockchainRecordId}
                onChange={(event) => {
                  setBlockchainRecordId(
                    event.target.value
                  );
                  setBlockchainError("");
                  setVerificationResult(null);
                }}
                placeholder="INS006"
              />

            </div>

          </div>

          <button
            className="primary-button"
            type="button"
            onClick={readBlockchainRecord}
            disabled={blockchainLoading}
          >
            {blockchainLoading
              ? "Reading..."
              : "Read Record"}
          </button>

          {blockchainError && (
            <div
              className="empty-state"
              style={{
                marginTop: "16px"
              }}
            >
              {blockchainError}
            </div>
          )}

        </section>

        {blockchainRecord && (

          <section className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Blockchain Record
                </h2>

                <p>
                  Record retrieved directly from the
                  smart contract.
                </p>

              </div>

              <span className="badge success">
                {blockchainRecord.status}
              </span>

            </div>

            <div className="blockchain-info">

              <div>
                <span>Record ID</span>
                <strong>
                  {blockchainRecord.recordId}
                </strong>
              </div>

              <div>
                <span>Building ID</span>
                <strong>
                  {blockchainRecord.buildingId}
                </strong>
              </div>

              <div>
                <span>Record Type</span>
                <strong>
                  {blockchainRecord.recordType}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {blockchainRecord.status}
                </strong>
              </div>

              <div
                style={{
                  gridColumn: "1 / -1"
                }}
              >
                <span>Data Hash</span>
                <strong
                  className="contract-address"
                  style={{
                    wordBreak: "break-all"
                  }}
                >
                  {blockchainRecord.dataHash}
                </strong>
              </div>

              <div>
                <span>Timestamp</span>
                <strong>
                  {formatBlockchainTimestamp(
                    blockchainRecord.timestamp
                  )}
                </strong>
              </div>

              <div>
                <span>Recorded By</span>
                <strong
                  className="contract-address"
                  style={{
                    wordBreak: "break-all"
                  }}
                >
                  {blockchainRecord.recordedBy}
                </strong>
              </div>

            </div>

          </section>

        )}

        {blockchainRecord && (

          <section className="panel form-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Verify Data Hash
                </h2>

                <p>
                  Compare a hash with the value stored
                  on the blockchain.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div
                className="form-group"
                style={{
                  gridColumn: "1 / -1"
                }}
              >

                <label>
                  Data Hash
                </label>

                <input
                  type="text"
                  value={verifyHash}
                  onChange={(event) => {
                    setVerifyHash(
                      event.target.value
                    );
                    setVerificationResult(null);
                  }}
                  placeholder={
                    blockchainRecord.dataHash
                  }
                />

              </div>

            </div>

            <button
              className="primary-button"
              type="button"
              onClick={verifyBlockchainRecord}
            >
              Verify Hash
            </button>

            {verificationResult && (
              <div
                className="empty-state"
                style={{
                  marginTop: "16px",
                  border:
                    verificationResult.success
                      ? "1px solid #b7e4c7"
                      : "1px solid #f5b5b5"
                }}
              >
                <strong>
                  {verificationResult.success
                    ? "Verification successful"
                    : "Verification result"}
                </strong>

                <p
                  style={{
                    marginTop: "8px"
                  }}
                >
                  {verificationResult.message}
                </p>
              </div>
            )}

          </section>

        )}
      </>
    );
  };

  // ======================================================
  // PLACEHOLDER PAGES
  // ======================================================

  const renderPlaceholder = (page) => {
    return (
      <>
        <header className="topbar">

          <div>

            <h1>
              {page}
            </h1>

            <p>
              {page} management section.
            </p>

          </div>

        </header>

        <section className="panel">

          <div className="empty-state">

            <h2>
              {page}
            </h2>

            <p
              style={{
                marginTop: "10px"
              }}
            >
              This section will be connected
              to the backend next.
            </p>

          </div>

        </section>
      </>
    );
  };

  // ======================================================
  // PAGE SELECTOR
  // ======================================================

  const renderPage = () => {

    if (activePage === "Dashboard") {
      return renderDashboard();
    }

    if (activePage === "Buildings") {
      return renderBuildings();
    }

    if (activePage === "Inspections") {
      return renderInspections();
    }

    if (activePage === "Violations") {
      return renderViolations();
    }

    if (activePage === "Corrective Actions") {
      return renderCorrectiveActions();
    }

    if (activePage === "Re-inspections") {
      return renderReinspections();
    }

    if (activePage === "Certificates") {
      return renderCertificates();
    }

    if (activePage === "Blockchain") {
      return renderBlockchain();
    }

    return renderPlaceholder(
      activePage
    );
  };

  // ======================================================
  // NAVIGATION
  // ======================================================

  const navigationItems = [
    ["📊", "Dashboard"],
    ["🏢", "Buildings"],
    ["🔍", "Inspections"],
    ["⚠️", "Violations"],
    ["🛠️", "Corrective Actions"],
    ["✅", "Re-inspections"],
    ["📜", "Certificates"],
    ["⛓️", "Blockchain"]
  ];

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            🔥
          </div>

          <div>

            <h2>
              FireSafe
            </h2>

            <p>
              Blockchain System
            </p>

          </div>

        </div>

        <nav>

          {navigationItems.map(
            ([icon, label]) => (

              <button
                key={label}
                className={
                  activePage === label
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setActivePage(label)
                }
              >

                <span>
                  {icon}
                </span>

                {label}

              </button>

            )
          )}

        </nav>

      </aside>

      <main className="main">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EHRCore {
  // Basic data structures
  struct Patient {
    address id;
    string name;
    string email;
    bool isActive;
  }

  struct Doctor {
    address id;
    string name;
    string email;
    string specialization;
    string licenseNumber;
    bool isActive;
  }

  // Mappings
  mapping (address => Patient) public patients;
  mapping (address => Doctor) public doctors;
  mapping (address => address[]) public doctorPatients; // Doctors to their patients
  mapping (address => address[]) public patientDoctors; // Patients to their doctors

  // Events
  event PatientAdded(address patientId);
  event DoctorAdded(address doctorId);
  event PatientDetailsUpdated(address patientId);
  event DoctorDetailsUpdated(address doctorId);
  event DoctorAssignedToPatient(address doctorId, address patientId);

  // Modifiers
  modifier senderExists {
    require(doctors[msg.sender].id == msg.sender || patients[msg.sender].id == msg.sender, "Sender does not exist");
    _;
  }

  modifier patientExists(address patientId) {
    require(patients[patientId].id == patientId, "Patient does not exist");
    _;
  }

  modifier senderIsDoctor {
    require(doctors[msg.sender].id == msg.sender, "Sender is not a doctor");
    _;
  }
  
  modifier senderIsPatient {
    require(patients[msg.sender].id == msg.sender, "Sender is not a patient");
    _;
  }
  
  modifier doctorExists(address doctorId) {
    require(doctors[doctorId].id == doctorId, "Doctor does not exist");
    _;
  }
  
  modifier isDoctorOfPatient(address patientId) {
    bool isDoctor = false;
    for (uint i = 0; i < patientDoctors[patientId].length; i++) {
      if (patientDoctors[patientId][i] == msg.sender) {
        isDoctor = true;
        break;
      }
    }
    require(isDoctor || msg.sender == patientId, "Not authorized");
    _;
  }

  // Core functions
  function addPatient(address _patientId) public senderIsDoctor {
    require(patients[_patientId].id != _patientId, "Patient exists");
    patients[_patientId].id = _patientId;
    patients[_patientId].isActive = true;
    
    doctorPatients[msg.sender].push(_patientId);
    patientDoctors[_patientId].push(msg.sender);

    emit PatientAdded(_patientId);
    emit DoctorAssignedToPatient(msg.sender, _patientId);
  }

  function addDoctor() public {
    require(doctors[msg.sender].id != msg.sender, "Doctor exists");
    doctors[msg.sender].id = msg.sender;
    doctors[msg.sender].isActive = true;

    emit DoctorAdded(msg.sender);
  }

  function updatePatientDetails(string memory _name, string memory _email) public senderIsPatient {
    patients[msg.sender].name = _name;
    patients[msg.sender].email = _email;
    
    emit PatientDetailsUpdated(msg.sender);
  }
  
  function updateDoctorDetails(
    string memory _name, 
    string memory _email, 
    string memory _specialization, 
    string memory _licenseNumber
  ) public senderIsDoctor {
    doctors[msg.sender].name = _name;
    doctors[msg.sender].email = _email;
    doctors[msg.sender].specialization = _specialization;
    doctors[msg.sender].licenseNumber = _licenseNumber;
    
    emit DoctorDetailsUpdated(msg.sender);
  }

  function getSenderRole() public view returns (string memory) {
    if (doctors[msg.sender].id == msg.sender) {
      return "doctor";
    } else if (patients[msg.sender].id == msg.sender) {
      return "patient";
    } else {
      return "unknown";
    }
  }

  function getPatientExists(address _patientId) public view senderIsDoctor returns (bool) {
    return patients[_patientId].id == _patientId;
  }
  
  // Assign doctor to patient
  function assignDoctor(address _doctorId) public senderIsPatient doctorExists(_doctorId) {
    // Check if doctor is already assigned
    bool isAssigned = false;
    for (uint i = 0; i < patientDoctors[msg.sender].length; i++) {
      if (patientDoctors[msg.sender][i] == _doctorId) {
        isAssigned = true;
        break;
      }
    }
    
    require(!isAssigned, "Doctor already assigned");
    
    patientDoctors[msg.sender].push(_doctorId);
    doctorPatients[_doctorId].push(msg.sender);
    
    emit DoctorAssignedToPatient(_doctorId, msg.sender);
  }
  
  // Get doctors of a patient
  function getPatientDoctors(address _patientId) public view patientExists(_patientId) returns (address[] memory) {
    require(msg.sender == _patientId, "Only patient can view");
    return patientDoctors[_patientId];
  }
  
  // Get patients of a doctor
  function getDoctorPatients(address _doctorId) public view doctorExists(_doctorId) returns (address[] memory) {
    require(msg.sender == _doctorId, "Only doctor can view");
    return doctorPatients[_doctorId];
  }
}
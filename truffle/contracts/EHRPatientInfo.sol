// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./EHRCore.sol";

contract EHRPatientInfo is EHRCore {
  struct Insurance {
    string policyNumber;
    string company;
    uint256 expiryDate;
  }

  struct Allergy {
    string name;
    string allergyType;
    string medication;
  }

  struct MedicalHistory {
    string description;
    uint256 date;
    string doctorName;
    string treatmentInfo;
  }

  // Mappings
  mapping (address => Insurance[]) public patientInsurances;
  mapping (address => Allergy[]) public patientAllergies;
  mapping (address => MedicalHistory[]) public patientMedicalHistories;

  // Events
  event InsuranceAdded(address patientId, string policyNumber);
  event AllergyAdded(address patientId, string allergyName);
  event MedicalHistoryAdded(address patientId);

  // Add insurance
  function addInsurance(
    string memory _policyNumber, 
    string memory _company, 
    uint256 _expiryDate
  ) public senderIsPatient {
    Insurance memory insurance = Insurance(_policyNumber, _company, _expiryDate);
    patientInsurances[msg.sender].push(insurance);
    
    emit InsuranceAdded(msg.sender, _policyNumber);
  }
  
  // Get patient insurances
  function getInsurances(address _patientId) public view patientExists(_patientId) isDoctorOfPatient(_patientId) returns (Insurance[] memory) {
    return patientInsurances[_patientId];
  }
  
  // Add allergy
  function addAllergy(
    string memory _name, 
    string memory _allergyType, 
    string memory _medication
  ) public senderIsPatient {
    Allergy memory allergy = Allergy(_name, _allergyType, _medication);
    patientAllergies[msg.sender].push(allergy);
    
    emit AllergyAdded(msg.sender, _name);
  }
  
  // Get patient allergies
  function getAllergies(address _patientId) public view patientExists(_patientId) isDoctorOfPatient(_patientId) returns (Allergy[] memory) {
    return patientAllergies[_patientId];
  }
  
  // Add medical history
  function addMedicalHistory(
    string memory _description, 
    uint256 _date, 
    string memory _doctorName, 
    string memory _treatmentInfo
  ) public senderIsPatient {
    MedicalHistory memory medicalHistory = MedicalHistory(_description, _date, _doctorName, _treatmentInfo);
    patientMedicalHistories[msg.sender].push(medicalHistory);
    
    emit MedicalHistoryAdded(msg.sender);
  }
  
  // Get patient medical histories
  function getMedicalHistories(address _patientId) public view patientExists(_patientId) isDoctorOfPatient(_patientId) returns (MedicalHistory[] memory) {
    return patientMedicalHistories[_patientId];
  }
}
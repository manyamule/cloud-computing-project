// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./EHRCore.sol";

contract EHRRecords is EHRCore {
  struct Record { 
    string cid;
    string fileName; 
    address patientId;
    address doctorId;
    uint256 timeAdded;
  }

  struct HospitalizationRecord {
    string hospitalName;
    uint256 admissionDate;
    uint256 dischargeDate;
    string reason;
    string treatmentInfo;
  }

  struct CheckupRecord {
    uint256 date;
    string doctorName;
    string findings;
    string recommendations;
  }

  // Mappings for records
  mapping(address => Record[]) private patientRecords;
  mapping(address => HospitalizationRecord[]) public patientHospitalizations;
  mapping(address => CheckupRecord[]) public patientCheckups;

  // Events
  event RecordAdded(string cid, address patientId, address doctorId);
  event HospitalizationAdded(address patientId);
  event CheckupAdded(address patientId);

  // Add medical record
  function addRecord(string memory _cid, string memory _fileName, address _patientId) public senderIsDoctor patientExists(_patientId) {
    Record memory record = Record(_cid, _fileName, _patientId, msg.sender, block.timestamp);
    patientRecords[_patientId].push(record);

    emit RecordAdded(_cid, _patientId, msg.sender);
  } 

  // Get records for a patient
  function getRecords(address _patientId) public view senderExists patientExists(_patientId) returns (Record[] memory) {
    return patientRecords[_patientId];
  }

  // Add hospitalization record
  function addHospitalization(
    string memory _hospitalName, 
    uint256 _admissionDate, 
    uint256 _dischargeDate, 
    string memory _reason, 
    string memory _treatmentInfo
  ) public senderIsPatient {
    HospitalizationRecord memory hospitalization = HospitalizationRecord(
      _hospitalName, 
      _admissionDate, 
      _dischargeDate, 
      _reason, 
      _treatmentInfo
    );
    patientHospitalizations[msg.sender].push(hospitalization);
    
    emit HospitalizationAdded(msg.sender);
  }
  
  // Get patient hospitalizations
  function getHospitalizations(address _patientId) public view patientExists(_patientId) isDoctorOfPatient(_patientId) returns (HospitalizationRecord[] memory) {
    return patientHospitalizations[_patientId];
  }
  
  // Add checkup record
  function addCheckup(
    uint256 _date,
    string memory _doctorName,
    string memory _findings,
    string memory _recommendations
  ) public senderIsPatient {
    CheckupRecord memory checkup = CheckupRecord(_date, _doctorName, _findings, _recommendations);
    patientCheckups[msg.sender].push(checkup);
    
    emit CheckupAdded(msg.sender);
  }
  
  // Get patient checkups
  function getCheckups(address _patientId) public view patientExists(_patientId) isDoctorOfPatient(_patientId) returns (CheckupRecord[] memory) {
    return patientCheckups[_patientId];
  }
}
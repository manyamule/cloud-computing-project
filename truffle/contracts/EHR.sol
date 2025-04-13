// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./EHRRecords.sol";
import "./EHRPatientInfo.sol";

contract EHR is EHRRecords, EHRPatientInfo {
  // This contract inherits all functionality from EHRRecords and EHRPatientInfo
  // which in turn inherit from EHRCore
  
  // Additional functionality specific to the main contract can go here
  
  // Get all doctors (for patient to browse)
  function getAllDoctors() public view returns (address[] memory, string[] memory, string[] memory) {
    // First, count active doctors
    uint256 count = 0;
    uint256 maxAddresses = 100; // Limit search to reduce gas costs
    
    for (uint i = 0; i < maxAddresses; i++) {
      address doctorAddr = address(uint160(i));
      if (doctors[doctorAddr].isActive) {
        count++;
      }
    }
    
    // Create arrays to return
    address[] memory addresses = new address[](count);
    string[] memory names = new string[](count);
    string[] memory specializations = new string[](count);
    
    // Fill arrays
    uint256 index = 0;
    for (uint i = 0; i < maxAddresses; i++) {
      address doctorAddr = address(uint160(i));
      if (doctors[doctorAddr].isActive) {
        addresses[index] = doctorAddr;
        names[index] = doctors[doctorAddr].name;
        specializations[index] = doctors[doctorAddr].specialization;
        index++;
      }
      if (index >= count) break;
    }
    
    return (addresses, names, specializations);
  }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ENSRegistry {
    mapping(string => address) private nameToOwner;
    mapping(string => address) private nameToAddress;
    string[] private nameList;

    event NewName(string indexed name, address indexed owner, address indexed addr);

    modifier onlyOwner(string memory name) {
        require(nameToOwner[name] == msg.sender, "Only the owner can call this function.");
        _;
    }

    modifier validName(string memory name) {
        require(bytes(name).length >= 6, "Name too short");
        require(bytes(name).length <= 14, "Name too long");
        require(endsWith(name, ".eth"), "Name should end with .eth");

        _;
    }

    function owner(string memory name) public view returns (address) {
        return nameToOwner[name];
    }

    function resolve(string memory name) public view returns (address) {
        return nameToAddress[name];
    }

    function registerName(string memory name, address addr) public validName(name) {
        require(nameToOwner[name] == address(0x0), "This name is already name.");

        nameToOwner[name] = msg.sender;
        nameToAddress[name] = addr;
        nameList.push(name);

        emit NewName(name, msg.sender, addr);
    }

    function updateAddress(string memory name, address newAddr) public onlyOwner(name) {
        nameToAddress[name] = newAddr;

        emit NewName(name, msg.sender, newAddr);
    }

    function getNameByAddress(address addr) public view returns (string memory) {
        for (uint i = 0; i < nameList.length; i++) {
            if (nameToAddress[nameList[i]] == addr) {
                return nameList[i];
            }
        }
        return ""; // 해당 주소에 대한 이름이 없는 경우 빈 문자열 반환
    }
    function endsWith(string memory name, string memory suffix) private pure returns (bool) {
    bytes memory _name = bytes(name);
    bytes memory _suffix = bytes(suffix);
        if(_name.length >= _suffix.length) {
            for(uint i = 0; i < _suffix.length; i++) {
                if(_name[_name.length - i - 1] != _suffix[_suffix.length - i - 1]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

}

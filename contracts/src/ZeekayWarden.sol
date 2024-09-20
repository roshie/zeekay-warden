// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Interface to PlonkVerifier.sol
interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
}

contract ZeekayWarden {
    address public s_plonkVerifierAddress;
    event MemberVerified(bool result);

    // Member address => roles
    mapping(address => mapping(string => Membership)) public members;

    struct Membership {
        string[] roles;
        string platformUID;
    }

    constructor(address plonkVerifierAddress) 
    {
        s_plonkVerifierAddress = plonkVerifierAddress;
    }

    // ZK proof is generated in the browser and submitted as a transaction w/ the proof as bytes.
    function submitProofAndAddUser(bytes memory proof, uint256[] memory pubSignals, string[] memory data, string[] memory roles) public returns (bool) {
        bool result = IPlonkVerifier(s_plonkVerifierAddress).verifyProof(proof, pubSignals);

        if (result) {
            addUser(data, roles);
        }
        // Emit event
        emit MemberVerified(result);
        return result;
    }

    function addUser(string[] memory data, string[] memory roles) private {
        address user = msg.sender;
        string memory serverId = data[0];
        string memory platformUID = data[1];
        Membership memory member = Membership({platformUID: platformUID, roles: roles});
        members[user][serverId] = member;
    }


}  
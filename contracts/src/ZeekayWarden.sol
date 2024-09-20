// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Interface to PlonkVerifier.sol
interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
}

contract ZeekayWarden {
    address public s_plonkVerifierAddress;

    // ZK proof is generated in the browser and submitted as a transaction w/ the proof as bytes.
    function submitProofAndAddUser(bytes memory proof, uint256[] memory pubSignals, string[] memory data, string[] memory roles) public returns (bool) {
        bool result = IPlonkVerifier(s_plonkVerifierAddress).verifyProof(proof, pubSignals);

        return result;
    }


}  
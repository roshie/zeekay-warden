
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PlonkVerifierModule = buildModule("PlonkVerifierModule", (m: any) => {
  const plonkVerifier = m.contract("PlonkVerifier");

  return { plonkVerifier };
});

module.exports = PlonkVerifierModule;
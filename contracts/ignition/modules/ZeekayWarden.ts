const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PLONK_VERIFIER_ADDRESS = "0xeAb9C17c7ba35A3AD986f67335697f58704E6EBb";
const _initialOwner = "0x754a1Bc37F4B093aF9abD448b666A627020f3716";

const ZeekayWardenModule = buildModule("ZeekayWardenModule", (m: any) => {
  const plonkVerifierAddress = m.getParameter("plonkVerifierAddress", PLONK_VERIFIER_ADDRESS);
  const platformFee = m.getParameter("_platformFee", 1);
  const chainName = m.getParameter("_chainName", "airdao");
  const initialOwner = m.getParameter("initialOwner", _initialOwner);

  const zeekayWarden = m.contract("ZeekayWarden",[plonkVerifierAddress, platformFee, chainName, initialOwner]);

  return { zeekayWarden };
});

module.exports = ZeekayWardenModule;
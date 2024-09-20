const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZeekayWarden contract", function () {
  it("Get user roles", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract("Token");

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CroudFundingModule", (m) => {
  
  const CroudFunding = m.contract("CroudFunding");

  return { CroudFunding };
});

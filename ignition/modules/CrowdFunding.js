const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
//0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

module.exports = buildModule("CrowdFundingModule", (m) => {
  
  const CrowdFunding = m.contract("CrowdFunding");

  return { CrowdFunding };
});

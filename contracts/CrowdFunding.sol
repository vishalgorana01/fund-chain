//SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract CrowdFunding {
    struct Campaign {
        address payable owner;
        string title;
        string description;
        uint256 target;
        uint256 amountCollected;
        uint256 deadline;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address payable _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public returns (uint256) {
        Campaign storage newCampaign = campaigns[numberOfCampaigns];
        require(
            _deadline < block.timestamp,
            "Deadline should be in the future"
        );
        newCampaign.owner = _owner;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.target = _target;
        newCampaign.deadline = _deadline;
        newCampaign.amountCollected = 0;
        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _campaignId) public payable {
        Campaign storage selectedCampaign = campaigns[_campaignId];
        require(
            selectedCampaign.deadline > block.timestamp,
            "Campaign is closed"
        );
        require(
            selectedCampaign.amountCollected < selectedCampaign.target,
            "Campaign is already funded"
        );

        (bool sent, ) = selectedCampaign.owner.call{value: msg.value}("");
        if (sent) {
            selectedCampaign.amountCollected += msg.value;
            selectedCampaign.donators.push(msg.sender);
            selectedCampaign.donations.push(msg.value);
        }
    }

    function getDonators(uint256 _campaignId)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        return (
            campaigns[_campaignId].donators,
            campaigns[_campaignId].donations
        );
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }
}

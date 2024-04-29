"use client";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

//Internal Imports
import { CrowdFundingAbi, CrowdFundingAddress } from "./contants";

//Fetching the contract
const fetchContract = (signerOrProvider) => {
  new ethers.Contract(CrowdFundingAddress, CrowdFundingAbi, signerOrProvider);
};

//Context
export const CrowdFundingContext = React.createContext();

//Provider
export const CrowdFundingProvider = ({ children }) => {
  const titleData = "CrowdFunding";
  const [currentAccount, setCurrentAccount] = useState("");
  const [ethereum, setEthereum] = useState(undefined);

  const createCampaign = async (campaign) => {
    console.log("current account", currentAccount);
    if (ethereum && currentAccount) {
      const { title, description, target, deadline } = campaign;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CrowdFundingAddress,
        CrowdFundingAbi,
        signer
      );
      console.log("CONTRACT IS:", contract);
      try {
        const transaction = await contract.createCampaign(
          title,
          description,
          ethers.utils.parseUnits(target, 18),
          new Date(deadline).getTime(),
          {
            gasLimit: 5000000,
          }
        );
        await transaction.wait();
        console.log("Transaction Successful", transaction);
      } catch (error) {
        console.log("Contract Call Failed", error);
      }
    } else {
      console.log("Please connect your wallet");
    }
  };

  const getCampaigns = async () => {
    if (ethereum && currentAccount) {
      console.log("current account here", currentAccount);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(
        CrowdFundingAddress,
        CrowdFundingAbi,
        provider
      );
      console.log("CONTRACT IS:", contract);

      const campaigns = await contract.getCampaigns();

      console.log("CAMPAIGNS are as followed", campaigns);

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        titleData: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        pId: i,
      }));

      return parsedCampaigns;
    } else {
      console.log("Please connect your wallet getcampaign");
    }
  };

  const getUserCampaigns = async () => {
    if (ethereum && currentAccount) {
      console.log("current account here", currentAccount);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(
        CrowdFundingAddress,
        CrowdFundingAbi,
        provider
      );

      const allCampaigns = await contract.getCampaigns();
      console.log("allCampaigns are in usercampaign", allCampaigns);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const currentUser = accounts[0];
      console.log("currentUser in user campaign", currentUser);
      const filteredCampaigns = allCampaigns.filter(
        (campaign) => campaign.owner == currentUser
      );
      console.log("filteredCampaigns", filteredCampaigns);
      const userData = filteredCampaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        pId: i,
      }));
      console.log("userData", userData);
      return userData;
    } else {
      console.log("Please connect your wallet getUsercampaign");
    }
  };

  const donate = async (pId, amount) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const campaignData = await contract.donateToContract(pId, {
      value: ethers.utils.parseEther(amount),
    });
    await campaignData.wait();
    location.reload();
    return campaignData;
  };

  const getDonations = async (pId) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const donations = await contract.getDonators(pId);

    const numberOfDonations = donations[0].length;
    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        amount: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  //Check if wALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        return setOpenError(true), setError("Please install MetaMask");
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        setEthereum(window.ethereum);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log("Error- somthing wrong while connecting to wallet", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  //Connect Wallet
  const connectWallet = async () => {
    console.log("Connecting wallet");
    try {
      if (!window.ethereum) {
        return setOpenError(true), setError("Please install MetaMask");
      } else {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
        setEthereum(window.ethereum);
        console.log("Connected account", accounts[0]);
        console.log("Connected ethereum", ethereum);
      }
    } catch (error) {
      console.log("Error while connecting wallet", error);
    }
  };

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        connectWallet,
        ethereum,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};

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

    const createCampaign = async (campaign) => {
        const { title, description, target, deadline } = campaign;
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        console.log("current account", currentAccount);
        try {
            const transaction = await contract.createCampaign(
                currentAccount,
                title,
                description,
                ethers.utils.parseUnits(target, 18),
                new Date(deadline).getTime()
            );
            await transaction.wait();
            console.log("Transaction Successful", transaction);
        } catch (error) {
            console.log("Contract Call Failed", error);
        }
    };

    const getCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider(); //only provider needed since we are getting the data from contract not writing to it
        const contract = fetchContract(provider);

        const campaigns = await contract.getCampaigns();

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            titleData: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEthers(
                campaign.amountCollected.toString()
            ),
            pId: i,
        }));

        return parsedCampaigns;
    };

    const getUserCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const allCampaigns = await contract.getCampaigns();
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        const currentUser = accounts[0];

        const filteredCampaigns = allCampaigns.filter(
            (campaign) => campaign.owner === currentUser
        );

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

        return userData;
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
        try {
            if(!window.ethereum) {
                return setOpenError(true), setError("Please install MetaMask");
            }
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log("Error while connecting wallet", error);
        }
    };

    return (
        <CrowdFundingContext.Provider
            value={{
                title,
                currentAccount,
                createCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                connectWallet,
            }}
        >
            {children}
        </CrowdFundingContext.Provider>
    );
};

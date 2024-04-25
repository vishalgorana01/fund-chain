import React, {useState, useEffect} from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

//Internal Imports
import { CrowdFundingAbi, CrowdFundingAddress } from './contants';

//Fetching the contract
const fetchContract =(signerOrProvider) => {    
    new ethers.Contract(CrowdFundingAddress, CrowdFundingAbi, signerOrProvider);
}

//Context
export const CrowdFundingContext = React.createContext();

//Provider
export const CrowdFundingProvider = ({children}) => {
    const title = "CrowdFunding";
    const [currentAccount, setCurrentAccount] = useState("");
    
    const createCampaign = async (campaign) => {
        const {title, description, target, deadline} = campaign;
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        console.log("current account", currentAccount);
        try {
            const transaction = await contract.createCampaign(currentAccount, title, description, ethers.utils.parseUnits(target, 18), new Date(deadline).getTime());
            await transaction.wait();
            console.log("Transaction Successful", transaction);
        } catch (error) {
            console.log("Contract Call Failed", error);
        }
    }

    const getCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider(); //only provider needed since we are getting the data from contract not writing to it 
        const contract = fetchContract(provider);

        const campaigns = await contract.getCampaigns();

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner : campaign.owner,
            title : campaign.title,
            description : campaign.description,
            target : ethers.utils.formatEther(campaign.target.toString()),
            deadline : campaign.deadline.toNumber(),
            amountCollected : ethers.utils.formatEthers(campaign.amountCollected.toString()),
            pId : i,

        }));

        return parsedCampaigns;
    }

    return (
        <CrowdFundingContext.Provider value={{crowdFunding, loading}}>
            {children}
        </CrowdFundingContext.Provider>
    );
}
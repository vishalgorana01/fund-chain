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
        const {title, description, amount, deadline} = campaign;
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        console.log("current account", currentAccount);
        try {
            const transaction = await contract.createCampaign(currentAccount, title, description, ethers.utils.parseUnits(amount, 18), new Date(deadline).getTime());
            await transaction.wait();
            console.log("Transaction Successful", transaction);
        } catch (error) {
            console.log("Contract Call Failed", error);
        }
    }

    return (
        <CrowdFundingContext.Provider value={{crowdFunding, loading}}>
            {children}
        </CrowdFundingContext.Provider>
    );
}
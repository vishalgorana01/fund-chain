import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x0C7C8a579288cd3AE1236557C5CA7f5267Ce20e9"
);

export default instance;

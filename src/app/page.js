"use client"
import React,{ useState, useEffect, useContext} from "react";

import { CrowdFundingContext } from "@/context/CrowdFunding";
import { Hero, Card, PopUp } from "@/components";

export default function Home() {
  const {
    titleData,
    currentAccount,
    createCampaign,
    getCampaigns,
    getUserCampaigns,
    donate,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaigns] = useState();
  const [userCampaigns, setUserCampaigns] = useState();

  useEffect(() => {
    getCampaigns().then((data) => setAllCampaigns(data));
    getUserCampaigns().then((data) => setUserCampaigns(data));
  }, []);

//   Donate PopUp Modal
  const [opanModal, setOpanModal] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  console.log("donateCampaign", donateCampaign);

  return (
    <main>
      <Hero titleData={titleData} createCampaign={createCampaign} />

      <Card
        title="All Campaigns"
        allCampaigns={allCampaigns}
        setDonate={setDonateCampaign}
        setOpanModal={setOpanModal}
      />

      <Card
        title="Your Campaigns"
        allCampaigns={userCampaigns}
        setDonate={setDonateCampaign}
        setOpanModal={setOpanModal}
      />

      {opanModal && (
        <PopUp
          setOpanModal={setOpanModal}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
      hii there
    </main>
  );
}

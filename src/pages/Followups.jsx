import { useContext, useEffect, useState } from "react";
import FollowupModal from "../components/modals/FollowupModal";
import FollowUpQueueCard from "../components/followups/FollowUpQueueCard";
import FollowUpQueue from "../components/followups/FollowUpQueue";
import { userContext } from "../context/ContextProvider";
import { getFollowUpsApi } from "../utils/api.utils";

const FOLLOWUP_THRESHOLD_DAYS = 7;


const Followups = () => {
  const [queue, setQueue] = useState([]);
  const { accounts } = useContext(userContext);

  const counts = {
    Pending: queue.filter((x) => x.status === "Pending").length,
    Sent: queue.filter((x) => x.status === "Sent").length,
    Snoozed: queue.filter((x) => x.status === "Snoozed").length,
    All: queue.length,
  };

  const handlegetFollowUpsApi = async () => {
    try {
      const data = await getFollowUpsApi(
        accounts[0]?.id,
        accounts[0]?.gmailAccountId,
      );
      console.log("Follow-ups:", data);
      setQueue(data?.data?.data);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    }
  };

  useEffect(() => {
    if (accounts.length > 0) {
      handlegetFollowUpsApi();
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <FollowUpQueueCard
        counts={counts}
        FOLLOWUP_THRESHOLD_DAYS={FOLLOWUP_THRESHOLD_DAYS}
      />

      <FollowUpQueue queue={queue} counts={counts} setQueue={setQueue} handlegetFollowUpsApi={handlegetFollowUpsApi}/>
    </div>
  );
};

export default Followups;

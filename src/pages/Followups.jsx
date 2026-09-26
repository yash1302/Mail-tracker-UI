import { useCallback, useContext, useEffect, useState } from "react";
import FollowUpQueueCard from "../components/followups/FollowUpQueueCard.jsx";
import FollowUpQueue from "../components/followups/FollowUpQueue.jsx";
import { userContext } from "../context/userContext.js";
import { getFollowUpsApi } from "../utils/api.utils.js";
import { DEMO_FOLLOWUPS } from "../data/demoData.js";

const FOLLOWUP_THRESHOLD_DAYS = 7;

const Followups = () => {
  const [queue, setQueue] = useState([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const { accounts, demoMode } = useContext(userContext);

  const counts = {
    Pending: queue.filter((x) => x.status === "Pending").length,

    Snoozed: queue.filter((x) => x.status === "Stopped").length,

    Completed: queue.filter((x) => x.status === "Completed").length,

    All: queue.length,
  };

  const handlegetFollowUpsApi = useCallback(async () => {
    setIsLoadingQueue(true);

    try {
      if (demoMode) {
        setQueue(DEMO_FOLLOWUPS);
        return;
      }
      const data = await getFollowUpsApi(
        accounts[0]?.id,
        accounts[0]?.gmailAccountId,
      );
      setQueue(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    } finally {
      setIsLoadingQueue(false);
    }
  }, [accounts, demoMode]);

  useEffect(() => {
    if (demoMode) {
      setQueue(DEMO_FOLLOWUPS);
      setIsLoadingQueue(false);
      return;
    }
    if (accounts.length > 0) {
      handlegetFollowUpsApi();
    }
  }, [accounts, demoMode, handlegetFollowUpsApi]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <FollowUpQueueCard
        counts={counts}
        FOLLOWUP_THRESHOLD_DAYS={FOLLOWUP_THRESHOLD_DAYS}
      />

      <FollowUpQueue
        queue={queue}
        counts={counts}
        setQueue={setQueue}
        handlegetFollowUpsApi={handlegetFollowUpsApi}
        isLoadingQueue={isLoadingQueue}
        demoMode={demoMode}
      />
    </div>
  );
};

export default Followups;

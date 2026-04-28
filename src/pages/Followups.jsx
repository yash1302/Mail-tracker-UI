import { useCallback, useContext, useEffect, useState } from "react";
import FollowUpQueueCard from "../components/followups/FollowUpQueueCard.jsx";
import FollowUpQueue from "../components/followups/FollowUpQueue.jsx";
import { userContext } from "../context/userContext.js";
import { getFollowUpsApi } from "../utils/api.utils.js";

const FOLLOWUP_THRESHOLD_DAYS = 7;

const Followups = () => {
  const [queue, setQueue] = useState([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const { accounts } = useContext(userContext);

  // ✅ FIXED COUNTS
  const counts = {
    Pending: queue.filter((x) => x.status === "Pending").length,

    Snoozed: queue.filter((x) => x.status === "Stopped").length,

    Completed: queue.filter((x) => x.status === "Completed").length,

    All: queue.length,
  };

  const handlegetFollowUpsApi = useCallback(async () => {
    setIsLoadingQueue(true);
    try {
      const data = await getFollowUpsApi(
        accounts[0]?.id,
        accounts[0]?.gmailAccountId,
      );
      setQueue(data?.data?.data || []);
    } catch (_error) {
      console.error("Error fetching follow-ups:", _error);
    } finally {
      setIsLoadingQueue(false);
    }
  }, [accounts]);

  console.log(queue, "followup queue");

  useEffect(() => {
    if (accounts.length > 0) {
      handlegetFollowUpsApi();
    }
  }, [accounts, handlegetFollowUpsApi]);

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
      />
    </div>
  );
};

export default Followups;

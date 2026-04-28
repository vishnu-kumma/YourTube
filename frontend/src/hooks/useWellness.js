import { useEffect } from "react";
import { apiService } from "../services/apiService";

const useWellness = (setShowPopup) => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await apiService.healthcheck();

        if (res?.data?.triggerBreak) {
          setShowPopup(true);
        }
      } catch (err) {
        console.error("Healthcheck failed", err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);
};

export default useWellness;
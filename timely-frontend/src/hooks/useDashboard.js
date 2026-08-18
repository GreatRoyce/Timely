import { useCallback, useEffect, useState } from "react";
import { DATA_CHANGED_EVENT } from "../context/OrdersContext";
import { getApiErrorMessage } from "../lib/apiError";
import { getDashboardOverview } from "../lib/dashboardApi";

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setDashboard(await getDashboardOverview());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchDashboard, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchDashboard]);

  useEffect(() => {
    window.addEventListener(DATA_CHANGED_EVENT, fetchDashboard);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, fetchDashboard);
  }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
};

export default useDashboard;

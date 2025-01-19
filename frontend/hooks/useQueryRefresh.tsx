import { useState, useCallback } from "react";

const useQueryRefresh = (refetch: () => void) => {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);
  return { refreshing, handleRefresh };
};

export default useQueryRefresh;

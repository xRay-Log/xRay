import { useState, useEffect, useCallback } from 'react';
import { TIME_INTERVALS } from '../constants';
import api from '../services/api';

const initialState = {
  isConnected: false
};

const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useState(initialState);

  const checkServerHealth = useCallback(async () => {
    try {
      await api.checkHealth();
      setServerStatus({ isConnected: true });
    } catch (error) {
      setServerStatus({ isConnected: false });
    }
  }, []);

  useEffect(() => {
    checkServerHealth();
    const intervalId = setInterval(checkServerHealth, TIME_INTERVALS.SERVER_HEALTH_CHECK);
    return () => clearInterval(intervalId);
  }, [checkServerHealth]);

  return {
    isConnected: serverStatus.isConnected
  };
};

export default useServerStatus;
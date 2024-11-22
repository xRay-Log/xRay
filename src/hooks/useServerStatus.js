import { useState, useEffect, useCallback } from 'react';
import { TIME_INTERVALS } from '../constants';
import api from '../services/api';

const initialState = {
  isConnected: false,
  showErrorModal: false,
  lastError: null
};

const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useState(initialState);

  const setShowErrorModal = useCallback(show => {
    setServerStatus(prev => ({ ...prev, showErrorModal: show }));
  }, []);

  const checkServerHealth = useCallback(async () => {
    try {
      await api.checkHealth();
      setServerStatus(prev => ({
        ...prev,
        isConnected: true,
        showErrorModal: false,
        lastError: null
      }));
    } catch (error) {
      setServerStatus({
        isConnected: false,
        showErrorModal: true,
        lastError: error instanceof Error ? error.message : String(error)
      });
    }
  }, []);

  useEffect(() => {
    checkServerHealth();
    const intervalId = setInterval(checkServerHealth, TIME_INTERVALS.SERVER_HEALTH_CHECK);
    return () => clearInterval(intervalId);
  }, [checkServerHealth]);

  return {
    isConnected: serverStatus.isConnected,
    showErrorModal: serverStatus.showErrorModal,
    lastError: serverStatus.lastError,
    setShowErrorModal
  };
};

export default useServerStatus;
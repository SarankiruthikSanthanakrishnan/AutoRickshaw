import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

type ConnectivityContextType = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
};

const ConnectivityContext = createContext<ConnectivityContextType>({
  isConnected: true,
  isInternetReachable: true,
});

export const useConnectivity = () => useContext(ConnectivityContext);

export const ConnectivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<ConnectivityContextType>({
    isConnected: true,
    isInternetReachable: true,
  });

  const [hasShownOffline, setHasShownOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
      
      setStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });

      if (!isOnline) {
        if (!hasShownOffline) {
          Toast.show({
            type: 'error',
            text1: 'You are offline',
            text2: 'Please check your internet connection.',
            autoHide: false,
          });
          setHasShownOffline(true);
        }
      } else {
        if (hasShownOffline) {
          Toast.hide();
          Toast.show({
            type: 'success',
            text1: 'Back Online',
            text2: 'Internet connection restored.',
          });
          setHasShownOffline(false);
        }
      }
    });

    return () => unsubscribe();
  }, [hasShownOffline]);

  return (
    <ConnectivityContext.Provider value={status}>
      {children}
    </ConnectivityContext.Provider>
  );
};

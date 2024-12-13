import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import AppNavigation from './navigation/AppNavigation';
import { color } from './common/constants/color';
import { Provider as ProviderRedux } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux';
import LoadingOverlay from './components/loadingComponent';
import { ModalProvider } from './hooks/useBottomModal';
import { AlertProvider } from './hooks/useAlert';
import messaging from "@react-native-firebase/messaging";
import FCMService from "src/services/FCMService";
import NetworkErrorModal from './components/networkErrorModal';
const App: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    requestUserPermission();
    FCMService.getInstance();
    SplashScreen.hide();
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected); 
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const reloadApp = () => {
    setIsOffline(false);
  };

  return (
    <ProviderRedux store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ModalProvider>
            <AlertProvider>
              <StatusBar backgroundColor={color.sureface} barStyle="dark-content" />
              <NavigationContainer>
                <AppNavigation />
              </NavigationContainer>
              <LoadingOverlay />
              <NetworkErrorModal isOffline={isOffline} onRetry={reloadApp} />
            </AlertProvider>
          </ModalProvider>
        </SafeAreaProvider>
      </PersistGate>
    </ProviderRedux>
  );
};
export default App;

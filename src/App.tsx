import SplashScreen from 'react-native-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './navigation/AppNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { color } from './common/constants/color';
import { Provider as ProviderRedux } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux';
import LoadingOverlay from './components/loadingComponent';
import FCMHandler from "src/services/FCMService";
import messaging from "@react-native-firebase/messaging";
import FCMService from "src/services/FCMService";
export default function App() {
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
  }, []);
  return (
    <ProviderRedux store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar backgroundColor={color.sureface} barStyle="dark-content" />
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
          <LoadingOverlay />
        </SafeAreaProvider>
      </PersistGate>
    </ProviderRedux>
  );
}

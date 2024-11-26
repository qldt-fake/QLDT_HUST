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
import { ModalProvider } from './hooks/useBottomModal';
import { AlertProvider } from './hooks/useAlert';
import AttendanceScreen from './screens/attendance/Take_Atendance';
//import AttendanceScreen from './screens/attendance/AttendanceScreen';
export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <ProviderRedux store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ModalProvider>
            <AlertProvider>
              <StatusBar backgroundColor={color.sureface} barStyle='dark-content' />
              <NavigationContainer>
                <AppNavigation />
                {/* <AttendanceScreen/> */}
              </NavigationContainer>
              <LoadingOverlay />
            </AlertProvider>
          </ModalProvider>
        </SafeAreaProvider>
      </PersistGate>
    </ProviderRedux>
  );
}

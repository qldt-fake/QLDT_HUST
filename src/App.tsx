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

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <ProviderRedux store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar backgroundColor={color.sureface} barStyle='dark-content' />
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </ProviderRedux>
  );
}
// test

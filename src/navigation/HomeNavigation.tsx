import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from 'src/screens/auth/Login';
import { FirstScreen, VerifyOTPScreen, SaveInfoAccountScreen } from 'src/screens/auth/SignIn';
import { BaseHeader } from 'src/components/BaseHeader';
import ForgetPassword from 'src/screens/auth/ForgotPassword';
import { TransitionPresets } from '@react-navigation/stack';
import { AuthNavigationName, HomeNavigationName } from 'src/common/constants/nameScreen';
import { HomeTab } from 'src/screens/tab-bar';
import Login from 'src/screens/auth/Login';
const Stack = createNativeStackNavigator();
function HomeNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'vertical',
        header: () => <BaseHeader />
      }}
    >
      <Stack.Screen
        name={HomeNavigationName.Home}
        options={{ headerShown: false }}
        component={HomeTab}
      />
    </Stack.Navigator>
  );
}

export default HomeNavigation;

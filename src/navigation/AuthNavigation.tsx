import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from 'src/screens/auth/Login';
import { FirstScreen, VerifyOTPScreen, SaveInfoAccountScreen } from 'src/screens/auth/SignIn';
import { BaseHeader } from 'src/components/BaseHeader';
import ForgetPassword from 'src/screens/auth/ForgotPassword';
import { TransitionPresets } from '@react-navigation/stack';
import { AuthNavigationName } from 'src/common/constants/nameScreen';
import AccountLogin from 'src/screens/auth/AccountLogin';
import { color } from 'src/common/constants/color';

const Stack = createNativeStackNavigator();
function AuthNavigation() {
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
        name={AuthNavigationName.Login}
        options={{ headerShown: false }}
        component={LoginScreen}
      />
      <Stack.Screen name={AuthNavigationName.AccountLogin} component={AccountLogin} />
      <Stack.Group>
        <Stack.Screen name={AuthNavigationName.FirstScreen} component={FirstScreen} />
        <Stack.Screen name={AuthNavigationName.VerifyOTPScreen} component={VerifyOTPScreen} />
        <Stack.Screen
          name={AuthNavigationName.SaveInfoAccountScreen}
          component={SaveInfoAccountScreen}
        />
      </Stack.Group>
      <Stack.Screen name={AuthNavigationName.ForgotPasswordScreen} component={ForgetPassword} />
    </Stack.Navigator>
  );
}

export default AuthNavigation;

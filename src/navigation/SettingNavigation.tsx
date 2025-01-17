import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { color } from 'src/common/constants/color';
import { ProfileNavigationName, SettingNavigationName } from 'src/common/constants/nameScreen';
import WraperScreen from 'src/components/WraperScreen';
import {
  SettingScreen,
  BlockFriendScreen,
  SettingInfo,
  SettingInfoName,
  SettingNotification,
  SettingPassword,
  SettingPushNotification,
  SettingSecurityLogin,
  SearchUserScreen
} from 'src/screens/setting';
import ProfileScreen from 'src/screens/tab-bar/SettingTab/components/Profile/profile';

const Stack = createNativeStackNavigator();
function SettingNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'vertical',
        headerStyle: {
          backgroundColor: color.bgClassHeader, // Đặt màu nền của header
        },
        headerTintColor: color.white,
      }}
    >
      <Stack.Screen
        name={SettingNavigationName.SettingScreen}
        component={SettingScreen}
        options={{ title: 'Cài đặt' }}
      />
      <Stack.Screen
        name={SettingNavigationName.BlockFriendScreen}
        component={BlockFriendScreen}
        options={{ title: 'Chặn' }}
      />
      <Stack.Screen
        name={SettingNavigationName.SettingInfo}
        component={SettingInfo}
        options={{ title: '' }}
      />
      <Stack.Screen
        name={SettingNavigationName.SettingInfoName}
        component={SettingInfoName}
        options={{ title: 'Tên' }}
      />
      <Stack.Screen
        name={SettingNavigationName.SettingNotification}
        component={SettingNotification}
        options={{ title: 'Cài đặt thông báo' }}
      />
      <Stack.Screen
        name={SettingNavigationName.SettingPassword}
        component={SettingPassword}
        options={{ title: 'Đổi mật khẩu' }}
      />
      <Stack.Screen
        name={SettingNavigationName.SettingPushNotification}
        component={SettingPushNotification}
        options={{ title: 'Đẩy' }}
      />
      <Stack.Screen
        name={SettingNavigationName.SettingSecurityLogin}
        component={SettingSecurityLogin}
        options={{ title: '' }}
      />
      <Stack.Screen
        name={SettingNavigationName.SearchUserScreen}
        component={SearchUserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SettingNavigationName.Profile}
        options={{ title: 'Thông tin tài khoản' }}
        component={ProfileScreen}
      />
      {/* <Stack.Screen name={SettingNavigationName.SettingPassword} options={{ headerShown: true, title: 'Cài đặt' }} component={SettingPassword} /> */}
    </Stack.Navigator>
  );
}

const SettingNavigationWrapper = () => (
  <WraperScreen paddingBottom={0} paddingHorizontal={0}>
    <SettingNavigation />
  </WraperScreen>
);

export default SettingNavigationWrapper;

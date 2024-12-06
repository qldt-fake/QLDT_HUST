import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { NotificationNavigationName } from 'src/common/constants/nameScreen';
import WraperScreen from 'src/components/WraperScreen/WraperScreen';
import NotificationDetail from 'src/screens/notification/NotificationDetails/NotificationDetail';
import {NotificationNavigationType} from "src/common/type/navigation";

const Stack = createNativeStackNavigator<NotificationNavigationType>();
function NotificationNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }}
    >
      <Stack.Screen
        name={NotificationNavigationName.NotificationDetail}
        component={NotificationDetail}
      />
    </Stack.Navigator>
  );
}
const NotificationNavigationWrapper = () => (
  <WraperScreen paddingBottom={0} paddingHorizontal={0}>
    <NotificationNavigation />
  </WraperScreen>
);
export default NotificationNavigationWrapper;

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { NotificationNavigationName } from 'src/common/constants/nameScreen';
import WraperScreen from 'src/components/WraperScreen/WraperScreen';
import NotificationDetail from 'src/screens/notification/NotificationDetails/NotificationDetail';
import {NotificationNavigationType} from "src/common/type/navigation";
import ClassHeader from 'src/screens/classes/general/ClassHeader';
import { color } from 'src/common/constants/color';

const Stack = createNativeStackNavigator<NotificationNavigationType>();
function NotificationNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'vertical',
      }}
    >
      <Stack.Screen
        name={NotificationNavigationName.NotificationDetail}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Thông báo' />
        }}
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

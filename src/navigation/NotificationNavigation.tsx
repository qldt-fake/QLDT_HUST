import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {TransitionPresets} from "@react-navigation/stack";
import {NotificationNavigationName} from "src/common/constants/nameScreen";
import WraperScreen from "src/components/WraperScreen/WraperScreen";
import NotificationHome from "src/screens/notification/NotificationHome";
import {BaseHeader} from "src/components/BaseHeader";
import {color} from "src/common/constants/color";
import baseHeader from "src/components/BaseHeader/BaseHeader";
import NotificationDetail from "src/screens/notification/NotificationDetails/NotificationDetail";

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
                name={NotificationNavigationName.NotificationHome}
                component={NotificationHome}
            />
            <Stack.Screen
                name={NotificationNavigationName.NotificationDetail}
                component={NotificationDetail}
            />
        </Stack.Navigator>
        )
}
const NotificationNavigationWrapper = () => (
    <WraperScreen paddingBottom={0} paddingHorizontal={0}>
        <NotificationNavigation />
    </WraperScreen>
);
export default NotificationNavigationWrapper;
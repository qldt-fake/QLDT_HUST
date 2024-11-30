import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import {MessageNavigationName} from 'src/common/constants/nameScreen';
import WraperScreen from 'src/components/WraperScreen/WraperScreen';
import MessageBox from "src/screens/message/MessageBox/MessageBox";
import MessageHeader from "src/screens/message/components/MessageHeader";

const Stack = createNativeStackNavigator<MessageNavigationType>();
function MessageNavigation() {
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
                name={MessageNavigationName.MessageBox}
                component={MessageBox}

            />
        </Stack.Navigator>
    );
}
const MessageNavigationWrapper = () => (
    <WraperScreen paddingBottom={0} paddingHorizontal={0}>
        <MessageNavigation />
    </WraperScreen>
);
export default MessageNavigationWrapper;

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BaseHeader } from 'src/components/BaseHeader';
import { TransitionPresets } from '@react-navigation/stack';
import { ProfileNavigationName, TabNavigationName } from 'src/common/constants/nameScreen';
import { SettingTab } from 'src/screens/tab-bar';
import ProfileScreen from 'src/screens/tab-bar/SettingTab/components/Profile/profile';
const Stack = createNativeStackNavigator();
function SettingTabNavigation() {
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
            <Stack.Screen name={TabNavigationName.Setting} options={{ headerShown: false }} component={SettingTab} />
            <Stack.Group>
                <Stack.Screen name={ProfileNavigationName.Profile} options={{ headerShown: false }} component={ProfileScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default SettingTabNavigation;

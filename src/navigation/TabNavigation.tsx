import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-paper';
import { color as colors } from 'src/common/constants/color';
import WraperScreen from 'src/components/WraperScreen';
import HomeNavigation from './HomeNavigation';
import NotificationHome from 'src/screens/notification/NotificationHome';
import SettingTabNavigation from './SettingTabNavigation';
import MessageHome from "src/screens/message/MessageHome/MessageHome";
import { useSelector } from "react-redux";
import { selectAuth } from "src/redux/slices/authSlice";
import { getUnreadNotificationApi } from "src/services/noti.services";
import { useFocusEffect } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

function TabNavigation() {
    const [count, setCount] = useState<number>(0);
    const auth = useSelector(selectAuth);
    const user = auth.user;

    const getNotificationCount = async () => {
        if (user != null) {
            try {
                const response = await getUnreadNotificationApi({ token: user.token });
                setCount(Number(response.data));
            } catch (error) {
                console.error('Failed to fetch notification count:', error);
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getNotificationCount(); // Cập nhật khi tab nhận tiêu điểm
        }, [])
    );

    return (
        <Tab.Navigator
            screenOptions={{
                lazy: true,
                swipeEnabled: false,
                tabBarShowIcon: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarStyle: { backgroundColor: colors.sureface },
                tabBarPressColor: colors.borderColor,
                tabBarIndicatorStyle: { backgroundColor: colors.primary },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigation}
                options={{
                    tabBarIcon: ({ focused, color }) =>
                        focused ? (
                            <FontAwesomeIcon name="home" size={25} color={color} />
                        ) : (
                            <AntdIcon name="home" size={25} />
                        ),
                }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationHome}
                options={{
                    tabBarIcon: ({ focused, color }) =>
                        focused ? (
                            <MaterialIcons name="notifications" size={25} color={color} />
                        ) : (
                            <>
                                <MaterialIcons name="notifications-none" size={25} />
                                <Avatar.Text
                                    label={count === 0 ? "" : (count > 10 ? "10+" : count.toString())}
                                    size={21}
                                    style={style.newIcon}
                                    labelStyle={style.labelNewIcon}
                                />
                            </>
                        ),
                }}
            />
            <Tab.Screen
                name="Message"
                component={MessageHome}
                options={{
                    tabBarIcon: ({ focused, color }) =>
                        focused ? (
                            <MaterialIcons name="chat" size={25} color={color} />
                        ) : (
                            <>
                                <MaterialIcons name="chat" size={25} />
                                {/*<Avatar.Text*/}
                                {/*    label=""*/}
                                {/*    size={21}*/}
                                {/*    style={style.newIcon}*/}
                                {/*    labelStyle={style.labelNewIcon}*/}
                                {/*/>*/}
                            </>
                        ),
                }}
            />
            <Tab.Screen
                name="SettingTabNavigation"
                component={SettingTabNavigation}
                options={{
                    tabBarIcon: ({ focused, color }) =>
                        focused ? (
                            <MaterialIcons name="menu" size={25} color={color} />
                        ) : (
                            <MaterialIcons name="menu" size={25} />
                        ),
                }}
            />
        </Tab.Navigator>
    );
}

const TabNavigationWrapper = () => (
    <WraperScreen paddingBottom={0} paddingHorizontal={0}>
        <TabNavigation />
    </WraperScreen>
);

export default TabNavigationWrapper;

const style = StyleSheet.create({
    newIcon: {
        position: 'absolute',
        right: -8, // Đẩy sang phải
        backgroundColor: colors.red,
        top: -6, // Đẩy lên trên
        zIndex: 1, // Đảm bảo Avatar nằm trên biểu tượng
    },
    labelNewIcon: { fontSize: 10 },
});

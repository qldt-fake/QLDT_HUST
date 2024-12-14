import React, {useState} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Avatar} from 'react-native-paper';
import {color as colors} from 'src/common/constants/color';
import WraperScreen from 'src/components/WraperScreen';
import HomeNavigation from './HomeNavigation';
import NotificationHome from 'src/screens/notification/NotificationHome';
import SettingTabNavigation from './SettingTabNavigation';
import MessageHome from 'src/screens/message/MessageHome/MessageHome';
import {useSelector} from "react-redux";
import {selectAuth} from "src/redux/slices/authSlice";
import {getUnreadNotificationApi} from "src/services/noti.services";
import {useFocusEffect} from '@react-navigation/native';
import {getListConversationsApi} from "src/services/message.services";
import {FCMEnum} from "src/common/enum/FCMEnum";
import FCMService from "src/services/FCMService";

const Tab = createMaterialBottomTabNavigator();

function TabNavigation() {
    const [count, setCount] = useState<number>(0);
    const [countMessage, setCountMessage] = useState<number>(0);
    const auth = useSelector(selectAuth);
    const user = auth.user;

    const getNotificationCount = async () => {
        if (user != null) {
            try {
                const response = await getUnreadNotificationApi({token: user.token});
                setCount(Number(response.data));
            } catch (error) {
                console.error('Failed to fetch notification count:', error);
            }
        }
    };

    const getUnreadMessageCount = async () => {
        if (user != null) {
            try {
                const response = await getListConversationsApi({
                    token: user.token,
                    index: 0,
                    count: 1000,
                });
                setCountMessage(Number(response.data.num_new_message));
            } catch (error) {
                return null;
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const handleNotification = async (data: any) => {
                if (data.data.type === FCMEnum.MESSAGE) {
                    getUnreadMessageCount();
                } else if (data.data.type === FCMEnum.NOTIFICATION) {
                    getNotificationCount();
                }
            };

            FCMService.getInstance().on('newNotification', handleNotification);
            getNotificationCount();
            getUnreadMessageCount();
        }, [])
    );

    return (
        <Tab.Navigator
            shifting={true} // Thêm hiệu ứng chuyển đổi tab
            activeColor={colors.primary}
            inactiveColor={colors.primary}
            barStyle={{backgroundColor: colors.sureface}}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigation}
                options={{
                    tabBarIcon: ({color}) => (
                        <FontAwesomeIcon name="home" size={25} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationHome}
                options={{
                    tabBarIcon: ({color}) => (
                        <>
                            <MaterialIcons name="notifications" size={25} color={color}/>
                            {count === 0 || isNaN(count) ? null : (
                                <Avatar.Text
                                    label={(count > 99 ? "99+" : count.toString())}
                                    size={count < 9 ? 15 : count < 100 ? 21 : 30}
                                    style={style.newIcon}
                                    labelStyle={style.labelNewIcon}
                                />
                            )}
                        </>
                    ),
                }}
            />
            <Tab.Screen
                name="Message"
                component={MessageHome}
                options={{
                    tabBarIcon: ({color}) => (
                        <>
                            <MaterialIcons name="chat" size={25} color={color}/>
                            {countMessage === 0 || isNaN(countMessage) ? null : (
                                <Avatar.Text
                                    label={(countMessage > 99 ? "99+" : countMessage.toString())}
                                    size={countMessage < 9 ? 15 : countMessage < 100 ? 21 : 30}
                                    style={style.newIcon}
                                    labelStyle={style.labelNewIcon}
                                />
                            )}
                        </>
                    ),
                }}
            />
            <Tab.Screen
                name="SettingTabNavigation"
                component={SettingTabNavigation}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name="menu" size={25} color={color}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const TabNavigationWrapper = () => (
    <WraperScreen paddingBottom={0} paddingHorizontal={0}>
        <TabNavigation/>
    </WraperScreen>
);

export default TabNavigationWrapper;

const style = {
    newIcon: {
        position: 'absolute' as 'absolute',  // Chỉ rõ kiểu nếu cần
        right: -8,
        backgroundColor: colors.red,
        top: -6,
        zIndex: 1,
    },
    labelNewIcon: { fontSize: 10 },
};

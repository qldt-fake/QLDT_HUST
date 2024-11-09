import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeTab, NotificationTab, SettingTab } from 'src/screens/tab-bar';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { color as colors } from 'src/common/constants/color';
import WraperScreen from 'src/components/WraperScreen';
import { Avatar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import HomeNavigation from './HomeNavigation';
// import { useCallback, useEffect, useState } from 'react';
// import {
//   checkNewFriendItem,
//   checkNewNotificationItem,
//   checkNewPostItem,
//   checkNewVideoItem
// } from 'src/services/notification.service';

const tab = createMaterialTopTabNavigator();

function TabNavigation() {
  // const [newPosts, setNewPosts] = useState<string>('');
  // const [newVideos, setNewVideos] = useState<string>('');
  // const [newFriends, setNewFriends] = useState<string>('');
  // const [newNotifications, setNewNotifications] = useState<string>('');

  // useEffect(() => {
  //   async function getNewPostItem() {
  //     try {
  //       const res = await checkNewPostItem();
  //       console.log(res.data.new_items);
  //       if (res.success) {
  //         setNewPosts(res.data.new_items);
  //       }
  //     } catch (err) {
  //       return;
  //     }
  //   }
  //   getNewPostItem();
  // }, []);
  return (
    <tab.Navigator
      screenOptions={{
        tabBarShowIcon: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { backgroundColor: colors.sureface },
        tabBarPressColor: colors.borderColor,
        tabBarIndicatorStyle: { backgroundColor: colors.primary }
      }}
    >
      <tab.Screen
        name='Home'
        component={HomeNavigation}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <FontAwesomeIcon name='home' size={25} color={color} />
            ) : (
              <>
                <AntdIcon name='home' size={25} />
                <Avatar.Text
                  label='2'
                  size={15}
                  style={style.newIcon}
                  labelStyle={style.labelNewIcon}
                />
              </>
            )
        }}
      />
      <tab.Screen
        name='Notification'
        component={NotificationTab}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='notifications' size={25} color={color} />
            ) : (
              <>
                <MaterialIcons name='notifications-none' size={25} />
                <Avatar.Text
                  label='1'
                  size={14}
                  style={style.newIcon}
                  labelStyle={style.labelNewIcon}
                />
              </>
            )
        }}
      />
      <tab.Screen
        name='Setting'
        component={SettingTab}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='menu' size={25} color={color} />
            ) : (
              <MaterialIcons name='menu' size={25} />
            )
        }}
      />
    </tab.Navigator>
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
    right: -4,
    backgroundColor: colors.red,
    top: -2
  },
  labelNewIcon: { fontSize: 10 }
});

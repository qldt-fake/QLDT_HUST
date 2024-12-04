import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AttendanceScreen from 'src/screens/attendance/Take_Atendance'; // Đảm bảo đường dẫn đúng
import ListDateAttendanceScreen from 'src/screens/attendance/GetAttenDate'; // Đảm bảo đường dẫn đúng
import { View } from 'react-native';
import { Text } from 'react-native-paper';

// Khai báo Tab Navigator
const Tab = createMaterialTopTabNavigator();

const AttendanceMain = ({ route }: { route: any }) => {
  const { classId } = route.params;

  return (
    <Tab.Navigator
      initialRouteName='TakeAttendance'
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#00BFFF' }, // Màu chỉ báo tab
        tabBarStyle: { backgroundColor: '#f0f0f0' } // Màu nền của tab bar
      }}
    >
      {/* Tab điểm danh */}
      <Tab.Screen
        name='Điểm danh'
        component={AttendanceScreen as any}
        initialParams={{ classId }}
      />

      <Tab.Screen
        name='Xem lịch sử'
        component={ListDateAttendanceScreen as any}
        initialParams={{ classId }}
      />
    </Tab.Navigator>
  );
};

export default AttendanceMain;

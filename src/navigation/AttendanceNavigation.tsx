import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AttendanceNavigationName } from 'src/common/constants/nameScreen';
import ClassHeader from 'src/screens/classes/general/ClassHeader';
import { color } from 'src/common/constants/color';
import ClassDetail from 'src/screens/classes/general/ClassDeatail';
import CreateMaterial from 'src/screens/classes/Material/CreateMaterial';
import EditMaterial from 'src/screens/classes/Material/EditMaterial';
import AttendanceListPage from 'src/screens/attendance/GetAttendanceList';
import AttendanceScreen from 'src/screens/attendance/Take_Atendance';
import ListDateAttendanceScreen from 'src/screens/attendance/GetAttenDate';
import AttendanceMain from 'src/screens/attendance/AttendanceMain';
import GetAttendanceRecord from 'src/screens/attendance/GetAttendanceRecord';
const Stack = createNativeStackNavigator();

const AttendanceNavigation = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name={AttendanceNavigationName.AttendanceMain}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Điểm danh' textLogo='HUST' />
        }}
        component={AttendanceMain}
      />
      <Stack.Screen
        name={AttendanceNavigationName.AttendanceListPage}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Danh sách sinh viên' textLogo='HUST' />
        }}
        component={AttendanceListPage}
      />
      <Stack.Screen
        name={AttendanceNavigationName.AttendanceScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Điểm danh' textLogo='HUST' />
        }}
        component={AttendanceScreen}
      />

      <Stack.Screen
        name={AttendanceNavigationName.ListDateAttendanceScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Ngày điểm danh' textLogo='HUST' />
        }}
        component={ListDateAttendanceScreen}
      />
      <Stack.Screen
        name={AttendanceNavigationName.GetAttendanceRecord}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Ngày điểm danh' textLogo='HUST' />
        }}
        component={GetAttendanceRecord}
      />
    </Stack.Group>
  );
};

export default AttendanceNavigation;

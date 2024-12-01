import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AbsenceNavigationName } from 'src/common/constants/nameScreen';
import { color } from 'src/common/constants/color';
import ClassHeader from 'src/screens/classes/general/ClassHeader';
import AbsenceRequest from 'src/screens/classes/Absence/RequestAbsence';
import AbsenceRequestList from 'src/screens/classes/Absence/AbsenceRequestList';
import AbsenceReview from 'src/screens/classes/Absence/ReviewAbsence';
import AllAbsenceRequestsForStudent from 'src/screens/classes/Absence/AllAbsenceRequestsForStudent';

const Stack = createNativeStackNavigator();

const AbsenceNavigation = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name={AbsenceNavigationName.RequestAbsence}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Xin phép vắng mặt' />
        }}
        component={AbsenceRequest as any}
      />
      <Stack.Screen
        name={AbsenceNavigationName.AbsenceList}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Danh sách xin nghỉ' />
        }}
        component={AbsenceRequestList as any}
      />
      <Stack.Screen
        name={AbsenceNavigationName.ReviewAbsence}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Danh sách xin nghỉ' />
        }}
        component={AbsenceReview as any}
      />

      <Stack.Screen
        name={AbsenceNavigationName.StudentAbsenceRequests}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Danh sách đơn xin nghỉ' />
        }}
        component={AllAbsenceRequestsForStudent as any}
      />
    </Stack.Group>
  );
};

export default AbsenceNavigation;

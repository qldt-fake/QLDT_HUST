import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassListPage from 'src/screens/classes/general/ClassListPage';
import ClassDetail from 'src/screens/classes/general/ClassDeatail';
import CreateClass from 'src/screens/classes/general/CreateClass';
import EditClass from 'src/screens/classes/general/EditClass';
import RegisterClass from 'src/screens/classes/general/RegisterClass';
import { ClassNavigationName } from 'src/common/constants/nameScreen';
import ClassHeader from 'src/screens/classes/general/ClassHeader';
import { color } from 'src/common/constants/color';
import SurveyNavigation from './SurveyNavigation';
import MaterialNavigation from './MaterialNavigation';
import ClassListOpen from 'src/screens/classes/classes-for-teacher/classOpen/ClassOpen';
import AddStudent from 'src/screens/classes/classes-for-teacher/AddStudent';
import StudentProfile from 'src/screens/classes/classes-for-teacher/classOpen/studentProfile';
import { ModalProvider } from 'src/hooks/useBottomModal';
import AbsenceNavigation from './AbsenceNavigation';

const Stack = createNativeStackNavigator();

const ClassNavigation = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name={ClassNavigationName.ClassList}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Class List' />
        }}
        component={ClassListPage}
      />
      <Stack.Screen
        name={ClassNavigationName.ClassDetail}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Class Details' />
        }}
        component={ClassDetail}
      />
      <Stack.Screen
        name={ClassNavigationName.CreateClass}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Create Class' />
        }}
        component={CreateClass}
      />
      <Stack.Screen
        name={ClassNavigationName.EditClass}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Edit Class' />
        }}
        component={EditClass as any}
      />
      <Stack.Screen
        name={ClassNavigationName.RegisterClass}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTintColor: color.white,
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Register Class' />
        }}
        component={RegisterClass}
      />
      <Stack.Screen
        name={ClassNavigationName.ClassListOpen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Danh sách lớp mở' />
        }}
        component={ClassListOpen}
      />
      <Stack.Screen
        name={ClassNavigationName.AddStudent}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Thêm học sinh vào lớp' />
        }}
        component={AddStudent}
      />
      <Stack.Screen
        name={ClassNavigationName.GetStudentInfor}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Thông tin sinh viên' />
        }}
        component={StudentProfile}
      />
      {SurveyNavigation()}
      {MaterialNavigation()}
      {AbsenceNavigation()}
    </Stack.Group>
  );
};

export default ClassNavigation;

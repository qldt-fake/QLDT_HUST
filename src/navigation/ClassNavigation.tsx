import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassListPage from 'src/screens/classes/classes-for-teacher/ClassListPage';
import ClassDetail from 'src/screens/classes/classes-for-teacher/ClassDeatail';
import CreateClass from 'src/screens/classes/classes-for-teacher/CreateClass';
import EditClass from 'src/screens/classes/classes-for-teacher/EditClass';
import RegisterClass from 'src/screens/classes/classes-for-teacher/RegisterClass';
import { ClassNavigationName } from 'src/common/constants/nameScreen';
import ClassHeader from 'src/screens/classes/classes-for-teacher/ClassHeader';
import { color } from 'src/common/constants/color';
import SurveyNavigation from './SurveyNavigation';
import MaterialNavigation from './MaterialNavigation';

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
          headerTitle: () => <ClassHeader title='Edit Class' />
        }}
        component={EditClass}
      />
      <Stack.Screen
        name={ClassNavigationName.RegisterClass}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Register Class' />
        }}
        component={RegisterClass}
      />

      {SurveyNavigation()}
      {MaterialNavigation()}
    </Stack.Group>
  );
};

export default ClassNavigation;

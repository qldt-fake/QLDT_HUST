import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateSurvey from 'src/screens/classes/Survey/CreateSurvey';
import HomeNavigation from './HomeNavigation';
import { SurveyNavigationName } from 'src/common/constants/nameScreen';
import ClassHeader from 'src/screens/classes/general/ClassHeader';
import { color } from 'src/common/constants/color';
import ClassDetail from 'src/screens/classes/general/ClassDeatail';
import EditSurvey from 'src/screens/classes/Survey/EditSurvey';

const Stack = createNativeStackNavigator();

const SurveyNavigation = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name={SurveyNavigationName.SurveyList}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Danh sách lớp học' textLogo='HUST' />
        }}
        component={ClassDetail}
        initialParams={{ initialTab: 'Assignment' }} // Truyền thông tin tab cần mở
      />
      <Stack.Screen
        name={SurveyNavigationName.CreateSurvey}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Create Survey' textLogo='HUST' />
        }}
        component={CreateSurvey}
      />

      <Stack.Screen
        name={SurveyNavigationName.EditSurvey}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Edit Survey' textLogo='HUST' />
        }}
        component={EditSurvey}
      />
    </Stack.Group>
  );
};

export default SurveyNavigation;

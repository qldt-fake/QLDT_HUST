import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateSurvey from 'src/screens/classes/Survey/CreateSurvey';
import HomeNavigation from './HomeNavigation';
import { SurveyNavigationName } from 'src/common/constants/nameScreen';
import ClassHeader from 'src/screens/classes/general/ClassHeader';
import { color } from 'src/common/constants/color';
import ClassDetail from 'src/screens/classes/general/ClassDeatail';
import EditSurvey from 'src/screens/classes/Survey/EditSurvey';
import SubmitSurvey from 'src/screens/classes/Survey/SubmitSurvey';
import AllSurveyForStudent from 'src/screens/classes/Survey/AllSurveyForStudent';
import SubmissionList from 'src/screens/classes/Survey/SubmissionList';
import GradeSubmission from 'src/screens/classes/Survey/GradeSubmission';
import SubmissionDetail from 'src/screens/classes/Survey/SubmissionDetail';
import Assignment from 'src/screens/classes/Survey/Assignment';


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
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Danh sách bài tập' textLogo='HUST' />
        }}
        component={Assignment as any}
      />
      <Stack.Screen
        name={SurveyNavigationName.CreateSurvey}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Create Survey' textLogo='HUST' />
        }}
        component={CreateSurvey as any}
      />

      <Stack.Screen
        name={SurveyNavigationName.EditSurvey}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Edit Survey' textLogo='HUST' />
        }}
        component={EditSurvey}
      />
      <Stack.Screen
        name={SurveyNavigationName.SubmitSurvey}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Submit Survey' textLogo='HUST' />
        }}
        component={SubmitSurvey}
      />
      <Stack.Screen
        name={SurveyNavigationName.StudentAssignments}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Bài tập' />
        }}
        component={AllSurveyForStudent}
      />
      <Stack.Screen
        name={SurveyNavigationName.SubmissionList}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Danh sách nộp bài' />
        }}
        component={SubmissionList}
      />
      <Stack.Screen
        name={SurveyNavigationName.GradeSubmission}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Chấm điểm' />
        }}
        component={GradeSubmission}
      />
            <Stack.Screen
        name={SurveyNavigationName.SubmissionDetail}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTintColor: color.white,
          headerTitle: () => <ClassHeader title='Chi tiết bài nộp' />
        }}
        component={SubmissionDetail}
      />
    </Stack.Group>
  );
};

export default SurveyNavigation;

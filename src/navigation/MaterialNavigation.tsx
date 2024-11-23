import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialNavigationName } from 'src/common/constants/nameScreen';
import ClassHeader from 'src/screens/classes/general/ClassHeader';
import { color } from 'src/common/constants/color';
import ClassDetail from 'src/screens/classes/general/ClassDeatail';
import CreateMaterial from 'src/screens/classes/Material/CreateMaterial';
import EditMaterial from 'src/screens/classes/Material/EditMaterial';
const Stack = createNativeStackNavigator();

const MaterialNavigation = () => {
  return (
    <Stack.Group
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name={MaterialNavigationName.MaterialList}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Danh sách Tài liệu' textLogo='HUST' />
        }}
        component={ClassDetail}
        initialParams={{ initialTab: 'Material' }} // Truyền thông tin tab cần mở
      />
      <Stack.Screen
        name={MaterialNavigationName.UploadMaterial}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Create Material' textLogo='HUST' />
        }}
        component={CreateMaterial}
      />

      <Stack.Screen
        name={MaterialNavigationName.EditMaterial}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: color.bgClassHeader
          },
          headerTitleAlign: 'center',
          headerTitle: () => <ClassHeader title='Edit Survey' textLogo='HUST' />
        }}
        component={EditMaterial}
      />
    </Stack.Group>
  );
};

export default MaterialNavigation;

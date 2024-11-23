import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Assignment from '../Survey/Assignment';
import ClassDetailSummary from './ClassDetailSummary';
import { getClassApi } from 'src/services/class.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import StudentCard from './StudentCard';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { color } from 'src/common/constants/color';
import MaterialScreen from '../Material/MaterialScreen';
import { ModalProvider } from '../../../hooks/useBottomModal';
import FloatingButton from '../../../components/FloatingButton/FloatingButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MaterialNavigationName, SurveyNavigationName } from 'src/common/constants/nameScreen';

const classDeatailContext = createContext(null);
const Tab = createMaterialTopTabNavigator();

const PostScreen = () => {
  const classId = useContext(classDeatailContext);
  const auth = useSelector(selectAuth);
  const user = auth.user;

  const [classDetail, setClassDetail] = useState<any>(null);

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        const res = await getClassApi({
          token: user?.token,
          role: user?.role,
          account_id: user?.id,
          class_id: classId
        });
        console.log('res', res);
        console.log('Student_account', res.data.student_accounts);
        if (res && res.data && res.meta.code === ReponseCode.CODE_OK) {
          setClassDetail(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClassDetail();
  }, [classId]);

  return (
    <View style={styles.center}>
      {classDetail && <ClassDetailSummary {...classDetail} />}
      <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: 18 }}>Danh sách lớp ( {classDetail?.student_count} )</Text>
      </View>
      <View>
        <FlatList
          data={classDetail?.student_accounts}
          renderItem={({ item }) => <StudentCard props={item} />}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const ClassDetail = ({ route }: { route: any }) => {
  const { classId } = route.params;
  const navigation: NavigationProp<any> = useNavigation();

  const handleCreateMaterial = () => {
    navigation.navigate(MaterialNavigationName.UploadMaterial, { classId });
  };

  const handleCreateAssignment = () => {
    navigation.navigate(SurveyNavigationName.CreateSurvey, { classId });
  };

  const actions = [
    { icon: 'upload', text: 'Tải lên', onPress: handleCreateMaterial },
    { icon: 'file', text: 'Tạo bài tập', onPress: handleCreateAssignment }
  ];

  console.log('classId', classId);
  return (
    <classDeatailContext.Provider value={classId}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIndicatorStyle: { backgroundColor: '#6200EE' }
          }}
        >
          <Tab.Screen name='General' component={PostScreen} />
          <Tab.Screen name='Material'>{() => <MaterialScreen classId={classId} />}</Tab.Screen>
          <Tab.Screen name='Assignment'>{() => <Assignment classId={classId} />}</Tab.Screen>
        </Tab.Navigator>
        <FloatingButton
          actions={actions}
          position={{ bottom: 100, right: 20 }} // Customize position here
        />
    </classDeatailContext.Provider>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    paddingTop: 15
  },
  list: {
    padding: 16
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 20
  },
  iconImg: {
    width: 35,
    height: 35
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  size: {
    fontSize: 14,
    color: '#888',
    marginTop: 4
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  modalOption: {
    paddingVertical: 12
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: color.red,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    zIndex: 10
  }
});

export default ClassDetail;
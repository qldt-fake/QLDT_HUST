import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Assignment from '../Survey/Assignment';
import ClassDetailSummary from './ClassDetailSummary';
import { getClassApi } from 'src/services/class.service';
import StudentCard from './StudentCard';
import { useSelector } from 'react-redux';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { color } from 'src/common/constants/color';
import MaterialScreen from '../Material/MaterialScreen';
import FloatingButton from '../../../components/FloatingButton/FloatingButton';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  ClassNavigationName,
  MaterialNavigationName,
  SurveyNavigationName
} from 'src/common/constants/nameScreen';
import { RefreshControl } from 'react-native';
import { useAppDispatch } from 'src/redux';
import { showLoading, hideLoading } from 'src/redux/slices/loadingSlice';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import AbsenceRequest from '../Absence/RequestAbsence';
import OthersTabInClass from '../others/OthersTabInClass';
export const classDeatailContext = createContext(null);
const Tab = createMaterialTopTabNavigator();

const PostScreen = () => {
  const classId = useContext(classDeatailContext);
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const [refreshing, setRefreshing] = useState(false);
  const [classDetail, setClassDetail] = useState<any>(null);
  const dispatch = useAppDispatch();
  const fetchClassDetail = async () => {
    try {
      dispatch(showLoading());
      const res = await getClassApi({
        token: user?.token,
        role: user?.role,
        account_id: user?.id,
        class_id: classId
      });
      if (res) {
        switch (res.meta?.code) {
          case CODE_OK:
            setClassDetail(res.data);
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền truy cập');
            break;
          default:
            Alert.alert('Lỗi', res.data);
            break;
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết lớp học:', error);
      Alert.alert('Lỗi', 'Lấy chi tiết lớp học thất bại');
    } finally {
      dispatch(hideLoading());
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchClassDetail();
    }, [classId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClassDetail(); // Gọi lại API để làm mới dữ liệu
    setRefreshing(false);
  };
  return (
    <View style={styles.center}>
      {classDetail && <ClassDetailSummary {...classDetail} />}
      <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
        <Text style={{ fontSize: 18 }}>Danh sách lớp ( {classDetail?.student_count} )</Text>
      </View>
      <SafeAreaView style={{ flex: 1, paddingBottom: 100 }}>
        <FlatList
          data={classDetail?.student_accounts}
          renderItem={({ item }) => <StudentCard props={item} />}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </SafeAreaView>
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
  const handleAddStudent = () => {
    navigation.navigate(ClassNavigationName.AddStudent, { class_id: classId });
  };

  const actions = [
    { icon: 'upload', text: 'Tải lên', onPress: handleCreateMaterial },
    { icon: 'file', text: 'Tạo bài tập', onPress: handleCreateAssignment },
    { icon: 'user', text: 'Thêm sinh viên', onPress: handleAddStudent }
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
        <Tab.Screen name='Others'>{() => <OthersTabInClass classId={classId} />}</Tab.Screen>
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

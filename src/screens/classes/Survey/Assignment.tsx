import { FlatList, StyleSheet, View, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import React, { useCallback, useContext } from 'react';
import BaseButton from 'src/components/BaseButton';
import ExcerciseCard from './ExcerciseCard';
import { getSurveyListApi, getSurveyStudentAssignmentsApi } from 'src/services/survey.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { color } from 'src/common/constants/color';
import { Roles, surveyStatus } from 'src/common/enum/commom';
import { SurveyNavigationName } from 'src/common/constants/nameScreen';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import EmptyState from 'src/components/EmptyState';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { SurveyNavigationType } from 'src/common/type/navigation';
import { classDeatailContext } from '../general/ClassDeatail';

const Assignment = ({route} : any) => {
  const classId = route?.params?.classId;
  const [assignmentList, setAssignmentList] = React.useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<surveyStatus | null>(null);
  const navigation: NavigationProp<SurveyNavigationType> = useNavigation();

  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  useFocusEffect(
    useCallback(() => {
      const fetchAllSurveys = async () => {
        try {
          dispatch(showLoading());
          let res = null;
          if (auth.user?.role === Roles.STUDENT) {
            res = await getSurveyStudentAssignmentsApi({
              token: auth?.user?.token,
              type: selectedFilter,
              class_id: classId
            });
          } else {
            res = await getSurveyListApi({
              token: auth?.user?.token,
              class_id: classId
            });
          }
          console.log('res', res);
          if (res) {
            switch (res.meta?.code) {
              case CODE_OK:
                setAssignmentList(res.data);
                break;
              case INVALID_TOKEN:
                Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại');
                dispatch(logout());
                break;
              case NOT_ACCESS:
                Alert.alert('Lỗi', 'Bạn không có quyền xem danh sách bài tập');
                navigation.goBack()
                break;
              default:
                Alert.alert('Lỗi', res.meta?.message ?? 'Lỗi không xác định');
                break;
            }
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu bài tập:', error);
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi lấy dữ liệu bài tập');
        } finally {
          dispatch(hideLoading());
        }
      };
      fetchAllSurveys();
    }, [auth?.user?.token, selectedFilter])
  );

  const handleFilterChange = (status: surveyStatus) => {
    if (selectedFilter === status) {
      setSelectedFilter(null);
      return;
    }
    setSelectedFilter(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      {auth.user?.role === Roles.STUDENT && (
        <View style={styles.boxFilters}>
          <BaseButton
            borderRadius={12}
            buttonColor={
              selectedFilter === surveyStatus.UPCOMING ? color.textRed : color.activeOutlineColor
            }
            textColor='white'
            mode='contained'
            onPress={() => handleFilterChange(surveyStatus.UPCOMING)}
          >
            Sắp tới
          </BaseButton>
          <BaseButton
            borderRadius={12}
            buttonColor={
              selectedFilter === surveyStatus.PASS_DUE ? color.textRed : color.activeOutlineColor
            }
            textColor='white'
            mode='contained'
            onPress={() => handleFilterChange(surveyStatus.PASS_DUE)}
          >
            Quá hạn
          </BaseButton>
          <BaseButton
            borderRadius={12}
            buttonColor={
              selectedFilter === surveyStatus.COMPLETED ? color.textRed : color.activeOutlineColor
            }
            textColor='white'
            mode='contained'
            onPress={() => handleFilterChange(surveyStatus.COMPLETED)}
          >
            Đã hoàn thành
          </BaseButton>
        </View>
      )}

      {assignmentList.length === 0 ? (
        <EmptyState title='Hiện chưa có bài tập cho lớp này' />
      ) : (
        <FlatList
          data={assignmentList}
          renderItem={data => (
            <ExcerciseCard {...data.item!} setAssignmentList={setAssignmentList} isInClass />
          )}
          keyExtractor={item => item?.id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingBottom: 100
  },
  boxFilters: {
    flexDirection: 'row',
    gap: 10,
    height: 50,
    paddingHorizontal: 10,
    marginTop: 20
  }
});

export default Assignment;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { getSurveyResponseApi } from 'src/services/survey.service';
import { SurveyNavigationName } from 'src/common/constants/nameScreen';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { color } from 'src/common/constants/color';
import EmptyState from 'src/components/EmptyState';
import { formatDateTime } from 'src/utils/helper';
import { DATE_TIME_FORMAT } from 'src/common/constants';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { SurveyNavigationType } from 'src/common/type/navigation';


const SubmissionList = ({ route }: any) => {
  const { id , title}: { id: string, title: string } = route.params;
  const [submissions, setSubmissions] = useState([]);
  const navigation: NavigationProp<SurveyNavigationType> = useNavigation();
  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      const fetchSubmissions = async () => {
        try {
          dispatch(showLoading());
          const res = await getSurveyResponseApi({
            token: auth?.user?.token,
            survey_id: id
          });
          if (res) {
            switch (res.meta?.code) {
              case CODE_OK:
                setSubmissions(res.data);
                break;
              case INVALID_TOKEN:
                Alert.alert('Lỗi', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
                break;
              case NOT_ACCESS:
                Alert.alert('Lỗi', 'Bạn không có quyền truy cập');
                break;
              default:
                Alert.alert('Lỗi', res.meta?.message ?? 'Lỗi xảy ra với server');
                break;
            }
          }
        } catch (error) {
          Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lấy dữ liệu');
        } finally {
          dispatch(hideLoading());
        }
      };
      fetchSubmissions();
    }, [id, auth])
  );

  const handlePress = (item: any) => {
    const { assignment_id, submission_time, text_response, file_url, student_account, id } = item;
    navigation.navigate(
      SurveyNavigationName.GradeSubmission,
      { assignment_id, submission_time, id, text_response, file_url, student_account, title }
    );
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.name}>
          {`${item.student_account?.first_name} ${item.student_account?.last_name}`}
        </Text>
        <Text style={styles.grade}>{item?.grade ? `Điểm: ${item?.grade}` : 'Chưa chấm điểm'}</Text>
      </View>
      <Text style={styles.email}>{item?.student_account.email}</Text>
      <Text style={styles.submitTime}>{`Đã nộp lúc ${formatDateTime(
        DATE_TIME_FORMAT.hh_mm_ss_vi_DD_MM_YYYY_DOT,
        new Date(item?.submission_time)
      )}`}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {submissions.length > 0 ? (
        <>
          <Text style={styles.title}>Danh sách bài nộp</Text>
          <FlatList
            data={submissions}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        </>
      ) : (
        <EmptyState title='Không có bài nộp nào' />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: color.backgroundColor },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: color.primary },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: color.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: color.borderColor
  },
  name: { fontSize: 18, fontWeight: 'bold', color: color.black },
  grade: { fontSize: 14, color: color.green, marginVertical: 5 },
  email: { fontSize: 14, color: color.blackOpacity },
  submitTime: { fontSize: 14, color: color.primary },
  empty: { textAlign: 'center', color: color.textGray, fontSize: 16, marginTop: 50 }
});

export default SubmissionList;

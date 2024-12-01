import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { color } from 'src/common/constants/color';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { getSurveyResponseApi } from 'src/services/survey.service';
import { formatDateTime } from 'src/utils/helper';
import { DATE_TIME_FORMAT } from 'src/common/constants';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';

const GradeSubmission = () => {
  const route = useRoute();
  console.log(route.params);
  const navigation = useNavigation();
  const { assignment_id, submission_time, id, text_response, file_url, student_account } =
    route.params as any;

  const [score, setScore] = useState('');

  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();

  const validateScore = () => {
    if (!score) {
      Alert.alert('Lỗi', 'Vui lòng nhập điểm');
      return false;
    }
    if (parseFloat(score) < 0 || parseFloat(score) > 10) {
      Alert.alert('Lỗi', 'Điểm phải nằm trong khoảng từ 0 đến 10');
      return false;
    }
    return true;
  }

  const handleGrade = async () => {
    try {
      dispatch(showLoading());
      const res = await getSurveyResponseApi({
        token: auth?.user?.token,
        survey_id: assignment_id,
        grade: { score, submission_id: id }
      });
      if (res) {
        switch (res.meta?.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Chấm điểm thành công');
            navigation.goBack();
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền truy cập');
            break;
          default:
            Alert.alert('Lỗi', res.data ?? 'Lỗi xảy ra với server');
            break;
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chấm điểm');
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Thông tin sinh viên</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Họ và tên:</Text>
          <Text
            style={styles.value}
          >{`${student_account?.first_name} ${student_account?.last_name}`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student_account?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mã sinh viên:</Text>
          <Text style={styles.value}>{student_account?.student_id}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.header}>Chi tiết bài làm</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Thời gian nộp:</Text>
          <Text style={styles.value}>
            {formatDateTime(DATE_TIME_FORMAT.hh_mm_ss_vi_DD_MM_YYYY_DOT, new Date(submission_time))}
          </Text>
        </View>
        {text_response && (
          <View style={styles.row}>
            <Text style={styles.label}>Phàn hồi:</Text>
            <Text numberOfLines={5} style={styles.value}>
              {text_response}
            </Text>
          </View>
        )}

        {file_url && (
          <TouchableOpacity onPress={() => Linking.openURL(file_url)} style={styles.fileButton}>
            <Text style={styles.fileButtonText}>Mở file tải lên của sinh viên</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.header}>Chấm điểm</Text>
        <TextInput
          style={styles.input}
          placeholder='Nhập điểm (VD: 8.5)'
          value={score}
          onChangeText={setScore}
          keyboardType='numeric'
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleGrade}>
          <Text style={styles.submitButtonText}>Lưu điểm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: color.backgroundColor },
  card: {
    backgroundColor: color.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: color.borderColor
  },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: color.primary },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  label: { fontSize: 16, fontWeight: '500', color: color.textGray },
  value: { fontSize: 16, color: color.black, flexShrink: 1, textAlign: 'right' },
  fileButton: {
    backgroundColor: color.red,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  fileButtonText: { color: color.white, fontSize: 16, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: color.outlineColor,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    fontSize: 16
  },
  submitButton: {
    backgroundColor: color.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15
  },
  submitButtonText: { color: color.white, fontSize: 16, fontWeight: '600' }
});

export default GradeSubmission;

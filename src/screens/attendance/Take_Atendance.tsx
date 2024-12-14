import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useSelector } from 'react-redux';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { getClassApi } from 'src/services/class.service';
import { takeAttendanceApi } from 'src/services/attendance.service';
import {
  CODE_OK,
  INVALID_TOKEN,
  NOT_ACCESS,
  PARAM_VALUE_INVALID
} from 'src/common/constants/responseCode';
import Icon from 'react-native-vector-icons/Ionicons';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';

// Định nghĩa kiểu dữ liệu cho navigation stack
type RootStackParamList = {
  AttendanceScreen: { classId: string };
};

// Khai báo kiểu cho route params
type AttendanceScreenRouteProp = RouteProp<RootStackParamList, 'AttendanceScreen'>;

interface AttendanceProps {
  route: AttendanceScreenRouteProp;
}

interface StudentAccount {
  account_id: string;
  first_name: string;
  last_name: string;
  student_id: string;
}

interface AttendanceListItem extends StudentAccount {
  present: boolean;
}

const AttendanceScreen: React.FC<AttendanceProps> = ({ route }) => {
  const navigation = useNavigation()
  const dispatch = useAppDispatch();
  const { classId } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [attendanceList, setAttendanceList] = useState<AttendanceListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useSelector(selectAuth);
  const user = auth?.user;

  const fetchClassDetail = useCallback(async () => {
    try {
      dispatch(showLoading());
      const res = await getClassApi({
        token: user?.token,
        role: user?.role,
        account_id: user?.id,
        class_id: classId
      });
      dispatch(hideLoading());
      if (res?.data && res.meta.code === CODE_OK) {
        setAttendanceList(
          res.data.student_accounts.map((student: StudentAccount) => ({
            ...student,
            present: true
          }))
        );
      } else {
        Alert.alert('Error', 'Failed to fetch class details');
      }
      if (res?.data && res.meta.code !== CODE_OK) {
        Alert.alert(res.meta.message);
      }
    } catch (error) {
      console.error('Error fetching class detail:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin lớp học.');
    }
  }, [user, classId]);

  useFocusEffect(
    useCallback(() => {
      fetchClassDetail();
    }, [fetchClassDetail])
  );

  const toggleAttendance = useCallback((id: string) => {
    setAttendanceList(prevList =>
      prevList.map(item => (item.account_id === id ? { ...item, present: !item.present } : item))
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const attendanceData = {
      token: user?.token,
      class_id: classId,
      date: formattedDate,
      attendance_list: attendanceList.filter(item => !item.present).map(item => item.student_id)
    };

    try {
      const res = await takeAttendanceApi(attendanceData);
      console.log(res);
      if (res) {
        switch (res.meta?.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Điểm danh đã được lưu.');
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền truy cập');
            navigation.goBack();
            break;
          case PARAM_VALUE_INVALID:
            Alert.alert('Lỗi', 'Ngày điểm danh không hợp lệ');
            break;
          case '447':
            Alert.alert('Lỗi', 'Network Error');
            break;
          default:
            Alert.alert('Lỗi', 'Đã xảy ra lỗi.');
            break;
        }
      }
    } catch (error) {
      console.error('Lỗi khi điểm danh:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi.');
    }

    setIsSubmitting(false);
  }, [isSubmitting, selectedDate, attendanceList, user?.token, classId]);

  if (attendanceList.length === 0) {
    return <Text style={styles.noStudents}>Không có sinh viên nào trong lớp.</Text>;
  }

  return (
    <View style={styles.containerMain}>
      <View style={styles.container}>
        {/* Date Picker */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Ngày điểm danh:</Text>
          <TouchableOpacity style={styles.selectDateButton} onPress={() => setOpen(true)}>
            <Text>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <DatePicker
            modal
            open={open}
            date={selectedDate}
            mode='date'
            onConfirm={date => {
              setSelectedDate(date);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </View>

        {/* Student List */}
        <FlatList
          data={attendanceList}
          keyExtractor={item => item.account_id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatarContainer}>
                <Icon name='person-circle' size={40} color='#888' />
              </View>

              <View style={styles.studentInfo}>
                <Text style={styles.name}>
                  {item.first_name} {item.last_name}
                </Text>
                <Text style={styles.accountId}>{item.account_id}</Text>
              </View>

              <TouchableOpacity onPress={() => toggleAttendance(item.account_id)}>
                <Icon
                  name={item.present ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={item.present ? 'green' : 'red'}
                />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.backButton, isSubmitting && { backgroundColor: '#ccc' }]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? 'Đang lưu...' : 'Submit'}</Text>
          </TouchableOpacity>
          <Text style={styles.summary}>
            Có mặt: {attendanceList.filter(item => item.present).length} | Vắng mặt:{' '}
            {attendanceList.filter(item => !item.present).length}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  datePickerContainer: { marginBottom: 16 },
  dateLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  selectDateButton: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  avatarContainer: { marginRight: 10 },
  studentInfo: { flex: 1 },
  name: { fontSize: 14, fontWeight: 'bold' },
  accountId: { fontSize: 11, color: '#888' },
  backButton: { padding: 10, backgroundColor: '#CC0000', borderRadius: 5 },
  buttonText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  footer: { marginTop: 10, alignItems: 'center', paddingBottom: 80 },
  summary: { fontSize: 14, marginVertical: 10 },
  noStudents: { textAlign: 'center', fontSize: 16, color: '#888' }
});

export default AttendanceScreen;

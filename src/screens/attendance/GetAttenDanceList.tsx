import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  SafeAreaView,
  Button
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootState } from 'src/redux';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { logout } from 'src/redux/slices/authSlice';
import { getAttendanceListApi, setAttendanceStatusApi } from 'src/services/attendance.service';
import EmptyState from 'src/components/EmptyState';
import { getClassApi } from 'src/services/class.service';

interface AttendanceItem {
  attendance_id: number;
  student_id: string;
  status: string;
}
interface StudentClassItem {
  account_id: string;
  last_name: string;
  first_name: string;
  email: string;
  student_id: string;
}

interface AttendanceStudentInfor {
  account_id: string;
  last_name: string;
  first_name: string;
  email: string;
  student_id: string;
  attendance_id: number;
}
interface AttendanceListPageProps {
  route: {
    params: {
      classId: number;
      item: string; // Date as string
    };
  };
}

const color = {
  red: '#FF0000',
  green: '#006400',
  orange: '#FFA500',
  grey: '#888'
};

const AttendanceListPage: React.FC<AttendanceListPageProps> = ({ route }) => {
  const { classId, item } = route.params;
  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>([]);
  const [classStudentList, setClassStudentList] = useState<StudentClassItem[]>([]);
  const [listStudent, setListStudent] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = useSelector((state: RootState) => state.auth.user);
  const { token } = user || {};
  const dispatch = useAppDispatch();

  const fetchAttendanceList = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await getAttendanceListApi({
        token,
        class_id: classId,
        date: item,
        pageable_request: { page: currentPage - 1, page_size: itemsPerPage }
      });
      if (response?.meta?.code === CODE_OK) {
        setAttendanceList(response.data.attendance_student_details);
        setTotalRecords(response.data.page_info.total_records);
      } else {
        handleApiError(response);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Lấy danh sách điểm danh thất bại');
    } finally {
      dispatch(hideLoading());
    }
  }, [token, classId, item, currentPage, dispatch]);

  const fetchStudentClassList = useCallback(async () => {
    try {
      dispatch(showLoading());

      console.log('//////', {
        token: user?.token,
        role: user?.role,
        account_id: user?.id,
        class_id: classId
      });
      const response = await getClassApi({
        token: user?.token,
        role: user?.role,
        account_id: user?.id,
        class_id: classId
      });
      if (response?.meta?.code === CODE_OK) {
        console.log('-----------Minh----------', response.data.student_accounts);
        setClassStudentList(response.data.student_accounts);
      } else {
        handleApiError(response);
      }
    } catch (error) {
    } finally {
      dispatch(hideLoading());
    }
  }, [token, classId, dispatch]);

  const handleApiError = (response: any) => {
    const errorMessages = {
      [INVALID_TOKEN]: 'Token không hợp lệ',
      [NOT_ACCESS]: 'Bạn không có quyền truy cập'
    };
    const message = errorMessages[response?.meta?.code] || 'Có lỗi xảy ra';
    Alert.alert('Lỗi', message);
    if (response?.meta?.code === INVALID_TOKEN) {
      dispatch(logout());
    }
  };

  const handleStatusUpdate = async (attendanceId: number, status: string) => {
    try {
      const response = await setAttendanceStatusApi({ token, attendance_id: attendanceId, status });
      if (response.meta.code === CODE_OK) {
        Alert.alert('Thành công', 'Cập nhật trạng thái thành công');
        setAttendanceList(prevList =>
          prevList.map(item => (item.attendance_id === attendanceId ? { ...item, status } : item))
        );
      } else {
        Alert.alert('Lỗi', 'Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handlePageChange = (direction: number) => {
    setCurrentPage(prevPage => {
      const newPage = prevPage + direction;
      const totalPages = Math.ceil(totalRecords / itemsPerPage);
      return newPage > 0 && newPage <= totalPages ? newPage : prevPage;
    });
  };

  const getStatusColor = useMemo(() => {
    return (status: string) => {
      switch (status) {
        case 'PRESENT':
          return color.green;
        case 'EXCUSED_ABSENCE':
          return color.orange;
        case 'UNEXCUSED_ABSENCE':
          return color.red;
        default:
          return color.grey;
      }
    };
  }, []);

  useEffect(() => {
    fetchAttendanceList();
  }, [fetchAttendanceList]);
  useEffect(() => {
    fetchStudentClassList();
  }, []);

  const matchInfor = attendanceList
    .map(item => {
      // Find the student object from classStudentList that matches the student_id
      const matchedStudent = classStudentList.find(
        student => student.student_id === item.student_id
      );

      // If a match is found, return the required properties
      if (matchedStudent) {
        return {
          account_id: matchedStudent.account_id,
          last_name: matchedStudent.last_name,
          first_name: matchedStudent.first_name,
          email: matchedStudent.email,
          student_id: matchedStudent.student_id,
          status: item.status,
          attendance_id: item.attendance_id
        };
      }
      return null;
    })
    .filter(student => student !== null);

  console.log('....................', matchInfor);
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <View style={styles.avatarContainer}>
        <Icon name='person-circle' size={40} color={color.grey} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.studentInfo}>{`Họ và tên : ${item.first_name} ${item.last_name}`}</Text>
        <Text style={styles.studentInfo}>{`Mã sinh viên: ${item.student_id}`}</Text>
        <Text style={styles.statusInfo}>
          Trạng thái: <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text>
        </Text>
        <View style={styles.statusButtons}>
          {['PRESENT', 'EXCUSED_ABSENCE', 'UNEXCUSED_ABSENCE'].map(status => (
            <Pressable key={status} onPress={() => handleStatusUpdate(item.attendance_id, status)}>
              <Text style={[styles.buttonText, { color: getStatusColor(status) }]}>{status}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.title}>Danh sách điểm danh:</Text> */}
      <View style={styles.body}>
        {matchInfor.length > 0 ? (
          <FlatList
            data={matchInfor}
            renderItem={renderItem}
            keyExtractor={item => item.attendance_id.toString()}
            contentContainerStyle={styles.list}
          />
        ) : (
          <EmptyState title='Không có dữ liệu điểm danh' />
        )}
      </View>
      {totalRecords > 0 && (
        <View style={styles.pagination}>
          <Button title='<' onPress={() => handlePageChange(-1)} disabled={currentPage === 1} />
          <Text style={styles.pageIndicator}>
            {`${currentPage} / ${Math.ceil(totalRecords / itemsPerPage)}`}
          </Text>
          <Button
            title='>'
            onPress={() => handlePageChange(1)}
            disabled={currentPage === Math.ceil(totalRecords / itemsPerPage)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', zIndex: 0 },
  title: { margin: 10, fontSize: 18 },
  body: { padding: 10, height: 600 },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 3
  },
  avatarContainer: { marginRight: 15 },
  infoContainer: { flex: 1 },
  studentInfo: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  statusInfo: { fontSize: 12, color: '#333', marginBottom: 10 },
  statusButtons: { flexDirection: 'row', gap: 10 },
  buttonText: { fontSize: 10, fontWeight: 'bold' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  pageIndicator: { fontSize: 16 }
});

export default AttendanceListPage;

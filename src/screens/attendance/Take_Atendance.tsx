import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import { useSelectclassIdor, useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { getClassApi } from 'src/services/class.service';
import { takeAttendanceApi } from 'src/services/attendance.service';
import { CODE_OK, INVALID_TOKEN, NO_DATA, PARAM_VALUE_INVALID } from 'src/common/constants/responseCode';

const classDeatailContext = createContext(null);

const AttendanceScreen = (args: { classId: string }) => {
  const { classId } = args;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);

  //const classId = useContext(classDeatailContext);
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const [classDetail, setClassDetail] = useState<any>(null);

  const fetchClassDetail = async () => {
    try {
      const res = await getClassApi({
        token: user?.token,
        role: user?.role,
        account_id: user?.id,
        class_id: classId
      });
      if (res && res.data && res.meta.code === ReponseCode.CODE_OK) {
        setClassDetail(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClassDetail();
  }, []);

  const userList = classDetail?.student_accounts || [];
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    if (classDetail?.student_accounts) {
      setAttendanceList(
        classDetail.student_accounts.map(user => ({
          ...user,
          present: true // Trạng thái điểm danh mặc định
        }))
      );
    }
  }, [classDetail]);


  const toggleAttendance = id => {
    setAttendanceList(prevList =>
      prevList.map(item => (item.account_id === id ? { ...item, present: !item.present } : item))
    );
  };

  const handleSave = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Chuyển đổi ngày thành "YYYY-MM-DD"

    const attendanceData = {
      token: user?.token,
      class_id: classId,
      date: formattedDate,
      attendance_list: attendanceList.filter(item => !item.present).map(item => item.student_id)
    };
    // const res = await takeAttendanceApi({
    //   token: user?.token,
    //   class_id: classId,
    //   date: date_attendance,
    //   attendance_list: ['1', '3']
    // });
    console.log(
      'date-----------------------------------------------------------------------------------------------------------------',
      attendanceData
    );
    const res = await takeAttendanceApi(attendanceData);
    console.log(res);
    setAttendanceList(userList.map(user => ({ ...user, present: true })));
    if (res.meta.code === CODE_OK) alert('Điểm danh đã được lưu thành công!');
    else if (res.meta.code === INVALID_TOKEN) alert('Token hết hạn! , Hãy đăng nhập lại');
    else if (res.meta.code === PARAM_VALUE_INVALID) alert('Ngày điểm danh không hợp lệ');
    else if (res.meta.code === NO_DATA) alert('Lớp học không tồn tại');
  };

  return (
    <View style={styles.containerMain}>
      <View style={styles.container}>
        {/* Bộ chọn ngày */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Ngày điểm danh:</Text>

          <TouchableOpacity
            style={styles.selectDateButton}
            onPress={() => setOpen(true)} // Mở DatePicker khi nhấn chọn ngày
          >
            <Text>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* Hiển thị DatePicker khi open là true */}
          <DatePicker
            modal
            open={open}
            date={selectedDate}
            mode='date'
            display='default'
            onConfirm={date => {
              setSelectedDate(date);
              setOpen(false); // Đóng DatePicker sau khi chọn ngày
            }}
            onCancel={() => {
              setOpen(false); // Đóng DatePicker nếu hủy
            }}
          />
        </View>

        {/* Danh sách sinh viên */}
        <FlatList
          data={attendanceList}
          keyExtractor={item => item.account_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>
                {item.first_name} {item.last_name}
              </Text>
              <Text style={styles.mssv}>ID: {item.account_id}</Text>
              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  { backgroundColor: item.present ? 'green' : 'red' }
                ]}
                onPress={() => toggleAttendance(item.account_id)}
              >
                <Text style={styles.attendanceText}>{item.present ? 'Có mặt' : 'Vắng mặt'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
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
  nameClass: {
    backgroundColor: '#CC0000',
    width: '100%',
    height: 48,
    justifyContent: 'center'
  },
  textClass: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 24
  },
  containerMain: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  datePickerContainer: {
    marginBottom: 16
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  selectDateButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 8
  },
  // selectDateText : {
  //   color : "red",
  // },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold'
  },
  mssv: {
    flex: 1,
    fontSize: 12
  },
  attendanceButton: {
    padding: 5,
    borderRadius: 5
  },
  attendanceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  footer: {
    marginTop: 10,
    alignItems: 'center'
  },
  summary: {
    fontSize: 14,
    marginVertical: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10
  },
  backButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC0000'
  }
});

export default AttendanceScreen;

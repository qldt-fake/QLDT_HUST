import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AttendanceScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const userList = [
    {
      account_id: 23,
      last_name: 'name',
      first_name: 'No',
      email: 'sv001@hust.edu.vn',
      student_id: 8
    },
    {
      account_id: 27,
      last_name: 'name',
      first_name: 'No',
      email: 'linh.vd215415@hust.edu.vn',
      student_id: 9
    },
    {
      account_id: 157,
      last_name: 'Anh Quân',
      first_name: 'Nguyễn',
      email: 'sv2021@hust.edu.vn',
      student_id: 47
    },
    {
      account_id: 189,
      last_name: 'Minh Hoang',
      first_name: 'Vu',
      email: 'vmh0@hust.edu.vn',
      student_id: 56
    },
    {
      account_id: 192,
      last_name: 'Quang Vũ',
      first_name: 'Lý',
      email: 'vu@hust.edu.vn',
      student_id: 58
    },
    {
      account_id: 210,
      last_name: 'thanh',
      first_name: 'nguyen',
      email: 'thanhxxx@hust.edu.vn',
      student_id: 64
    },
    {
      account_id: 242,
      last_name: 'Duy Tấn',
      first_name: 'Nguyễn',
      email: 'duytan@hust.edu.vn',
      student_id: 76
    },
    {
      account_id: 278,
      last_name: 'Anh Quân',
      first_name: 'Nguyễn',
      email: 'svqhqb@hust.edu.vn',
      student_id: 93
    },
    {
      account_id: 415,
      last_name: 'Kien',
      first_name: 'Nguyen',
      email: 'Kiennt99@hust.edu.vn',
      student_id: 149
    },
    {
      account_id: 446,
      last_name: 'Viên 1',
      first_name: 'Sinh',
      email: 'student1@hust.edu.vn',
      student_id: 161
    },
    {
      account_id: 480,
      last_name: 'Bfbf',
      first_name: 'Ndndn',
      email: 'Student123@hust.edu.vn',
      student_id: 174
    }
  ];

  // Danh sách điểm danh
  const [attendanceList, setAttendanceList] = useState(
    userList.map(user => ({
      ...user,
      present: true // Trạng thái điểm danh ban đầu là "có mặt"
    }))
  );

  const toggleAttendance = id => {
    setAttendanceList(prevList =>
      prevList.map(item => (item.student_id === id ? { ...item, present: !item.present } : item))
    );
  };

  const handleSave = () => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Chuyển đổi ngày thành "YYYY-MM-DD"

    const attendanceData = {
      date: formattedDate, // Lưu ngày theo định dạng mong muốn
      attendance_list: attendanceList.filter(item => item.present).map(item => item.student_id)
    };

    console.log('Data to save:', attendanceData);

    // Reset trạng thái điểm danh về mặc định
    setAttendanceList(userList.map(user => ({ ...user, present: true })));

    // Hiển thị thông báo và quay lại trang trước
    alert('Điểm danh đã được lưu thành công!');
    //navigation.goBack();  // Quay lại trang trước đó sau khi lưu
  };

  return (
    <View style={styles.containerMain}>
      <View style={styles.nameClass}>
        <Text style={styles.textClass}>IT1089</Text>
      </View>

      <View style={styles.container}>
        {/* Bộ chọn ngày */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Ngày điểm danh:</Text>
          <TouchableOpacity
            style={styles.selectDateButton}
            onPress={() => setShowDatePicker(true)} // Mở DateTimePicker khi nhấn chọn ngày
          >
            <Text>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* Hiển thị DateTimePicker khi showDatePicker là true */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode='date'
              display='default'
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                  setShowDatePicker(false); // Ẩn DateTimePicker sau khi chọn ngày
                }
              }}
            />
          )}
        </View>

        {/* Danh sách sinh viên */}
        <FlatList
          data={attendanceList}
          keyExtractor={item => item.student_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>
                {item.first_name} {item.last_name}
              </Text>
              <Text style={styles.mssv}>MSSV {item.student_id}</Text>
              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  { backgroundColor: item.present ? 'green' : 'red' }
                ]}
                onPress={() => toggleAttendance(item.student_id)}
              >
                <Text style={styles.attendanceText}>{item.present ? 'Có mặt' : 'Vắng mặt'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            {/* Nút quay lại */}
            <TouchableOpacity style={styles.backButton} onPress={() => /*navigation.goBack()*/ 1}>
              <Text style={styles.buttonText}>Quay lại</Text>
            </TouchableOpacity>

            {/* Nút lưu */}
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
    fontWeight: 'bold',
    color: 'black'
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

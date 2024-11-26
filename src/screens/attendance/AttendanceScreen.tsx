import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { getClassApi } from 'src/services/class.service';
import { StatusAttendance } from 'src/common/enum/commom';
import { takeAttendanceApi } from 'src/services/attendance.service';

const UserComponent = ({ account_id, last_name, first_name, student_id, status }: any) => {
  return (
    <View style={styles.userContainer}>
      <Text style={styles.item}>ID: {account_id}</Text>
      <Text style={styles.item}>{first_name} {last_name}</Text>
      <Text style={styles.item}>Student ID: {student_id}</Text>
      <Text style={styles.item}>Status: {status}</Text>
    </View>
  );
};

const AttendanceScreen = ({ classId }: { classId: string }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [classDetail, setClassDetail] = useState<any>(null);
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const [attendanceList, setAttendanceList] = useState<any>([]);

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

  useEffect(() => {
    if (classDetail?.student_accounts) {
      setAttendanceList(
        classDetail.student_accounts.map((user: any) => ({
          ...user,
          present: true // Trạng thái điểm danh mặc định
        }))
      );
    }
  }, [classDetail]);

  const toggleAttendance = (id: number) => {
    setAttendanceList(prevList =>
      prevList.map(item =>
        item.student_id === id ? { ...item, present: !item.present } : item
      )
    );
  };

  const handleSave = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0];

    const attendanceData = {
      date: formattedDate,
      attendance_list: attendanceList.filter((item: any) => !item.present).map((item: any) => item.student_id)
    };

    console.log('Data to Minh1:', attendanceData);
    setAttendanceList(attendanceList.map((user: any) => ({ ...user, present: true })));
//     const res = await takeAttendanceApi({
//     "token": "CBqkJ4",
//     "class_id": "000789",
//     "date": "2024-11-11",
//     "attendance_list": [
//         "1",
//         "3"
//     ]
// })

    alert('Điểm danh đã được lưu thành công ddieen!');
  };

  const renderItem = ({ item }: any) => (
    <UserComponent
      key={item.student_id}
      account_id={item.account_id}
      last_name={item.last_name}
      first_name={item.first_name}
      student_id={item.student_id}
      status={item.status}
    />
  );

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

          <DatePicker
            modal
            open={open}
            date={selectedDate}
            mode="date"
            display="default"
            onConfirm={(date) => {
              setSelectedDate(date);
              setOpen(false);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>

        <FlatList
          data={attendanceList}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.student_id.toString()}
          style={styles.list}
        />

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
  containerMain: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectDateButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  userContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
  },
  footer: {
    marginTop: 20,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  summary: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AttendanceScreen;

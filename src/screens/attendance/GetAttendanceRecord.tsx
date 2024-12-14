// import React, { useState, useEffect } from 'react';
// import { Alert, FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';
// import { Text, Card, IconButton } from 'react-native-paper';
// import { useSelector } from 'react-redux';
// import { CODE_OK } from 'src/common/constants/responseCode';
// import { selectAuth } from 'src/redux/slices/authSlice';
// import { getAttendanceRecordApi } from 'src/services/attendance.service';
// import moment from 'moment';
// import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { AttendanceNavigationName } from 'src/common/constants/nameScreen';

// interface RouteParams {
//   route: {
//     params: {
//       classId: string;
//     };
//   };
// }

// const GetAttendanceRecord: React.FC<RouteParams> = ({ route }) => {
//   const { classId } = route.params;
//   const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const auth = useSelector(selectAuth);
//   const user = auth?.user;
//   const navigation: NavigationProp<any> = useNavigation();

//   // Fetch attendance records from API
//   const fetchAttendanceDates = async (): Promise<void> => {
//     try {
//       const res = await getAttendanceRecordApi({
//         token: user?.token,
//         class_id: classId
//       });
//       if (res?.data && Array.isArray(res?.data?.absent_dates) && res.meta.code === CODE_OK) {
//         // Không loại bỏ trùng, giữ tất cả các ngày trả về
//         setAttendanceDates(res?.data?.absent_dates); // Chỉ cần gán nguyên mảng ngày vắng mặt
//       } else {
//         Alert.alert('Error', 'Failed to fetch attendance data');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'An error occurred while fetching attendance records');
//     }
//   };

//   // Fetch data when the component mounts
//   useEffect(() => {
//     fetchAttendanceDates();
//   }, []);

//   // Handle date selection
//   const handleDatePress = (item: string): void => {
//     setSelectedDate(item);
//     navigation.navigate(AttendanceNavigationName.AttendanceListPage, { classId, item });
//   };

//   // Format date to display in the format: DD/MM/YYYY
//   const formatDate = (date: string): string => {
//     return moment(date).format('DD/MM/YYYY'); // Format date as dd/mm/yyyy
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Danh sách ngày vắng mặt</Text>
//       <FlatList
//         data={attendanceDates} // Hiển thị tất cả các ngày, kể cả trùng nhau
//         keyExtractor={(item, index) => `${item}-${index}`} // Key unique cho mỗi item, bao gồm cả trùng
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleDatePress(item)}>
//             <Card style={[styles.card, selectedDate === item && styles.cardPressed]}>
//               <Card.Content style={styles.cardContent}>
//                 <IconButton icon='calendar-today' size={24} color='#d32f2f' style={styles.icon} />
//                 <Text style={styles.dateText}>Ngày {formatDate(item)}</Text>
//               </Card.Content>
//             </Card>
//           </TouchableOpacity>
//         )}
//         contentContainerStyle={styles.listContainer} // Added padding to list
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f9f9f9'
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#d32f2f'
//   },
//   card: {
//     marginBottom: 14,
//     paddingHorizontal: 0,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     elevation: 4,
//     borderColor: '#ff6666',
//     width: '100%',
//     alignSelf: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     transition: 'all 0.3s ease'
//   },
//   cardPressed: {
//     backgroundColor: '#fff',
//     borderColor: '#ff6666'
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   icon: {
//     marginRight: 8
//   },
//   dateText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#d32f2f'
//   },
//   listContainer: {
//     paddingBottom: 80 // Add padding at the bottom of the list
//   }
// });

// export default GetAttendanceRecord;

import React, { useState, useEffect } from 'react';
import { Alert, FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { CODE_OK } from 'src/common/constants/responseCode';
import { selectAuth } from 'src/redux/slices/authSlice';
import { getAttendanceRecordApi } from 'src/services/attendance.service';
import moment from 'moment';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AttendanceNavigationName } from 'src/common/constants/nameScreen';

interface RouteParams {
  route: {
    params: {
      classId: string;
    };
  };
}

const GetAttendanceRecord: React.FC<RouteParams> = ({ route }) => {
  const { classId } = route.params;
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const auth = useSelector(selectAuth);
  const user = auth?.user;
  const navigation: NavigationProp<any> = useNavigation();

  // Fetch attendance records from API
  const fetchAttendanceDates = async (): Promise<void> => {
    try {
      const res = await getAttendanceRecordApi({
        token: user?.token,
        class_id: classId
      });
      if (res?.data && Array.isArray(res?.data?.absent_dates) && res.meta.code === CODE_OK) {
        // Loại bỏ ngày trùng nhau bằng Set
        const uniqueDates = [...new Set(res?.data?.absent_dates)];
        setAttendanceDates(uniqueDates as string[]); // Gán danh sách đã loại bỏ trùng
      } else {
        Alert.alert('Error', 'Failed to fetch attendance data');
      }
      if(res?.data && res.meta.code !== CODE_OK) {
        Alert.alert(res.meta.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching attendance records');
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAttendanceDates();
  }, []);

  // Handle date selection
  const handleDatePress = (item: string): void => {
    setSelectedDate(item);
    navigation.navigate(AttendanceNavigationName.AttendanceListPage, { classId, item });
  };

  // Format date to display in the format: DD/MM/YYYY
  const formatDate = (date: string): string => {
    return moment(date).format('DD/MM/YYYY'); // Format date as dd/mm/yyyy
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách ngày vắng mặt</Text>
      <FlatList
        data={attendanceDates} // Hiển thị danh sách đã loại bỏ trùng
        keyExtractor={(item, index) => `${item}-${index}`} // Key unique cho mỗi item, bao gồm cả trùng
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDatePress(item)}>
            <Card style={[styles.card, selectedDate === item && styles.cardPressed]}>
              <Card.Content style={styles.cardContent}>
                <IconButton
                  icon='calendar-today'
                  size={24}
                  iconColor='#d32f2f'
                  style={styles.icon}
                />
                <Text style={styles.dateText}>Ngày {formatDate(item)}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer} // Added padding to list
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#d32f2f'
  },
  card: {
    marginBottom: 14,
    paddingHorizontal: 0,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 4,
    borderColor: '#ff6666',
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    transition: 'all 0.3s ease'
  },
  cardPressed: {
    backgroundColor: '#fff',
    borderColor: '#ff6666'
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginRight: 8
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d32f2f'
  },
  listContainer: {
    paddingBottom: 80 // Add padding at the bottom of the list
  }
});

export default GetAttendanceRecord;

import React, { useState, useCallback } from 'react';
import { Alert, FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { CODE_OK } from 'src/common/constants/responseCode';
import { selectAuth } from 'src/redux/slices/authSlice';
import { getDateAtendance } from 'src/services/attendance.service';
import moment from 'moment';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AttendanceNavigationName } from 'src/common/constants/nameScreen';

interface RouteParams {
  route: {
    params: {
      classId: string;
    };
  };
}

const ListDateAttendanceScreen: React.FC<RouteParams> = ({ route }) => {
  const { classId } = route.params;
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]); // State to store attendance dates
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // State for selected date
  const auth = useSelector(selectAuth);
  const user = auth?.user;
  const navigation: NavigationProp<any> = useNavigation();

  const fetchAttendanceDates = useCallback(async (): Promise<void> => {
    try {
      const res = await getDateAtendance({
        token: user?.token,
        class_id: classId
      });
      if (res?.data && Array.isArray(res?.data) && res.meta.code === CODE_OK) {
        setAttendanceDates(res?.data);
      } else {
        Alert.alert('Error', 'Failed to fetch class details');
      }
    } catch (error) {
      console.error('Error fetching attendance dates:', error);
    }
  }, [user?.token, classId]);

  useFocusEffect(
    useCallback(() => {
      fetchAttendanceDates();
    }, [fetchAttendanceDates])
  );

  const handleDatePress = (item: string): void => {
    setSelectedDate(item);
    navigation.navigate(AttendanceNavigationName.AttendanceListPage, { classId, item });
  };

  const formatDate = (date: string): string => {
    return moment(date).format('DD/MM/YYYY'); // Format date as dd/mm/yyyy
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách ngày điểm danh</Text>
      <FlatList
        data={attendanceDates}
        keyExtractor={(item, index) => item.toString()}
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
        contentContainerStyle={styles.listContainer}
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
    paddingBottom: 80
  }
});

export default ListDateAttendanceScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import { useNavigation } from '@react-navigation/native';
import {
  AbsenceNavigationName,
  ClassNavigationName,
  SurveyNavigationName
} from 'src/common/constants/nameScreen';
import { selectAuth } from 'src/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { Roles } from 'src/common/enum/commom';

export default function HomeTab() {
  const navigation = useNavigation();
  const auth = useSelector(selectAuth);
  return (
    <View style={styles.container}>
        <Card
          style={styles.card}
          onPress={() => navigation.navigate(ClassNavigationName.RegisterClass as never)}
        >
          <View style={styles.iconContainer}>
            <IconButton icon='calendar' iconColor={color.red} size={50} />
          </View>
          <Text style={styles.title}>Đăng ký lớp</Text>
          <Text style={styles.description}>Đăng ký lớp học tập trong kỳ</Text>
        </Card>
      <Card
        style={styles.card}
        onPress={() => navigation.navigate(ClassNavigationName.ClassList as never)}
      >
        <View style={styles.iconContainer}>
          <IconButton icon='account-cog' iconColor={color.red} size={50} />
        </View>
        <Text style={styles.title}>Quản lý lớp học</Text>
        <Text style={styles.description}>Quản lý thông tin lớp học</Text>
      </Card>

        <Card
          style={styles.card}
          onPress={() => navigation.navigate(AbsenceNavigationName.StudentAbsenceRequests as never)}
        >
          <View style={styles.iconContainer}>
            <IconButton icon='file-document' iconColor={color.red} size={50} />
          </View>
          <Text style={styles.title}>Biểu mẫu</Text>
          <Text style={styles.description}>Thông tin các đồ án</Text>
        </Card>
        <Card
          style={styles.card}
          onPress={() => navigation.navigate(SurveyNavigationName.StudentAssignments as never)}
        >
          <View style={styles.iconContainer}>
            <IconButton icon='book-open' iconColor={color.red} size={50} />
          </View>
          <Text style={styles.title}>Bài tập</Text>
          <Text style={styles.description}>Danh sách bài tập</Text>
        </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f4f8'
  },
  card: {
    width: '45%',
    marginVertical: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#f0f4f8',
    borderRadius: 50,
    padding: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333'
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import { useNavigation } from '@react-navigation/native';
import { ClassNavigationName } from 'src/common/constants/nameScreen';

export default function HomeTab() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>

      <Card style={styles.card} onPress={() => navigation.navigate(ClassNavigationName.RegisterClass as never)}>
        <View style={styles.iconContainer}>
          <IconButton icon='calendar' iconColor={color.red}
            size={50} />
        </View>
        <Text style={styles.title}>Thời khóa biểu</Text>
        <Text style={styles.description}>Tra cứu thời khóa biểu, lịch thi</Text>
      </Card>

      <Card style={styles.card} onPress={() => navigation.navigate(ClassNavigationName.ClassList as never)}>
        <View style={styles.iconContainer}>
          <IconButton icon='account-cog' iconColor={color.red} size={50} />
        </View>
        <Text style={styles.title}>Quản lý lớp học</Text>
        <Text style={styles.description}>Quản lý thông tin lớp học</Text>
      </Card>

      <Card style={styles.card} onPress={() => navigation.navigate(`` as never)}>
        <View style={styles.iconContainer}>
          <IconButton icon='file-document' iconColor={color.red}
            size={50} />
        </View>
        <Text style={styles.title}>Biểu mẫu</Text>
        <Text style={styles.description}>Thông tin các đồ án</Text>
      </Card>

      <Card style={styles.card} onPress={() => navigation.navigate(`` as never)}>
        <View style={styles.iconContainer}>
          <IconButton icon='information' iconColor={color.red}
            size={50} />
        </View>
        <Text style={styles.title}>About us</Text>
        <Text style={styles.description}>Về chúng tôi</Text>
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
    backgroundColor: '#f0f4f8',
  },
  card: {
    width: '45%',
    marginVertical: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#f0f4f8',
    borderRadius: 50,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

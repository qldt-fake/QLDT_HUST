import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ClassHeader from './ClassHeader';
import { color } from 'src/common/constants/color';
const ClassManagement = () => {
  // Danh sách lớp mẫu
  const classListData = [
    { classId: 'D14TH05', includedClassId: 'D14TH06', className: 'Lớp học 1' },
    { classId: 'D14TH07', includedClassId: 'D14TH08', className: 'Lớp học 2' },
    { classId: 'D14TH09', includedClassId: 'D14TH10', className: 'Lớp học 3' },
    { classId: 'D14TH11', includedClassId: 'D14TH12', className: 'Lớp học 4' },
    { classId: 'D14TH13', includedClassId: 'D14TH14', className: 'Lớp học 5' },
    { classId: 'D14TH15', includedClassId: 'D14TH16', className: 'Lớp học 6' },
    { classId: 'D14TH17', includedClassId: 'D14TH18', className: 'Lớp học 7' },
    { classId: 'D14TH19', includedClassId: 'D14TH20', className: 'Lớp học 8' },
    { classId: 'D14TH21', includedClassId: 'D14TH22', className: 'Lớp học 9' },
    { classId: 'D14TH23', includedClassId: 'D14TH24', className: 'Lớp học 10' }
  ];

  return (
    <View style={styles.container}>
     <ClassHeader title = "Class Management"/>
      <View style={styles.body}>
        <View style={styles.searchContainer}>
          <TextInput style={styles.input} placeholder='Mã lớp' />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.buttonText}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Mã lớp</Text>
          <Text style={styles.tableHeaderText}>Mã lớp kèm</Text>
          <Text style={styles.tableHeaderText}>Tên lớp</Text>
        </View>
        <View style={styles.classList}>
          <FlatList
            data={classListData}
            keyExtractor={item => item.classId}
            renderItem={({ item }) => (
              <View style={styles.classItem}>
                <Text style={styles.classItemText}>{item.classId}</Text>
                <Text style={styles.classItemText}>{item.includedClassId}</Text>
                <Text style={styles.classItemText}>{item.className}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.buttonText}>Tạo lớp học</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.footerText}>Thông tin danh sách các lớp mở</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  body: {
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '100%',
    maxHeight: 500,
    marginTop: 40 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'space-between',
    height: 50
  },
  input: {
    borderWidth: 1,
    borderColor: '#b30000',
    padding: 10,
    borderRadius: 5,
    flex: 6,
    marginRight: 10
  },
  searchButton: {
    backgroundColor: '#b30000',
    borderRadius: 5,
    flex: 4,
    height: '100%',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 16
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#b30000',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10
  },
  tableHeaderText: {
    color: '#fff',
    textAlign: 'center',
    flex: 1
  },
  classList: {
    borderWidth: 1,
    borderColor: '#b30000',
    borderRadius: 5,
    width: '100%',
    height: 250,
    marginBottom: 20,
    padding: 10
  },
  classItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5
  },
  classItemText: {
    color: '#b30000',
    textAlign: 'center',
    flex: 1
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  createButton: {
    backgroundColor: '#b30000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 6,
    marginRight: 10
  },
  editButton: {
    backgroundColor: '#b30000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 4
  },
  footerText: {
    color: '#b30000',
    textDecorationLine: 'underline',
    marginTop: 120,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ClassManagement;

import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import ClassHeader from './ClassHeader';
import { color } from 'src/common/constants/color';
import { getBasicClassInfoApi, registerClassApi } from 'src/services/class.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { Checkbox } from 'react-native-paper';
import { formatDate } from 'src/utils/helper';
import { selectAuth } from 'src/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
interface ClassItem {
  class_id: string;
  class_name: string;
  start_date: string;
  end_date: string;
  status?: string;
}

const RegisterClass = () => {
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const dispatch = useAppDispatch();
  const [tempClassList, setTempClassList] = React.useState<ClassItem[]>([]); // Sửa kiểu cho tempClassList
  const [searchText, setSearchText] = React.useState<string>(''); // Kiểu cho searchText
  const [selectedClasses, setSelectedClasses] = React.useState<Record<string, boolean>>({}); // Kiểu cho selectedClasses

  // Hàm xử lý chọn lớp
  const handleSelectClass = (classId: string) => {
    setSelectedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId]
    }));
  };

  // Hàm xóa lớp đã chọn
  const handleDeleteSelectedClasses = () => {
    setTempClassList(prevList => prevList.filter(item => !selectedClasses[item.class_id]));
    setSelectedClasses({});
  };

  // Hàm tìm kiếm lớp
  const handleSearchClass = async () => {
    if (!searchText.trim()) return;

    try {
      dispatch(showLoading()); // Hiển thị loading
      const response = await getBasicClassInfoApi({
        class_id: searchText,
        token: user?.token,
        role: user?.role,
        account_id: user?.id
      });
      dispatch(hideLoading()); // Hiển thị loading

      if (response && response.data && response.meta.code === ReponseCode.CODE_OK) {
        const isClassAdded = tempClassList.some(item => item.class_id === response.data.class_id);

        if (!isClassAdded) {
          const { class_id, class_name, start_date, end_date } = response.data;
          setTempClassList(prevList => [
            ...prevList,
            {
              class_id,
              class_name,
              start_date,
              end_date
            }
          ]);
        } else {
          Alert.alert('Thông báo', 'Lớp này đã có trong danh sách');
        }
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy lớp');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tìm kiếm lớp');
    }
  };

  // Hàm đăng ký các lớp
  const handleRegisterClasses = async () => {
    try {
      const response = await registerClassApi({
        token: user?.token,
        class_ids: tempClassList.map(item => item.class_id)
      });

      if (response.meta.code === ReponseCode.CODE_OK) {
        Alert.alert('Thành công', 'Đăng ký lớp thành công');
        const updatedStatusClass = response.data;
        setTempClassList(prevList =>
          prevList.map(item => {
            const updatedClass = updatedStatusClass.find(
              (cls: ClassItem) => cls.class_id === item.class_id
            );
            return updatedClass ? { ...item, status: updatedClass.status } : item;
          })
        );
      } else {
        Alert.alert('Lỗi', 'Đăng ký lớp thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng ký lớp');
    }
  };

  return (
    <View style={styles.container}>
      <ClassHeader title='Register for class' />
      <View style={styles.body}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder='Mã lớp'
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchClass}>
            <Text style={styles.buttonText}>Tìm lớp</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Chọn</Text>
          <Text style={styles.tableHeaderText}>Mã lớp</Text>
          <Text style={styles.tableHeaderText}>Tên lớp</Text>
          <Text style={styles.tableHeaderText}>Ngày bắt đầu</Text>
          <Text style={styles.tableHeaderText}>Ngày kết thúc</Text>
          <Text style={styles.tableHeaderText}>Trạng thái</Text>
        </View>
        <View style={styles.classList}>
          {tempClassList.length ? (
            <FlatList
              data={tempClassList}
              keyExtractor={item => item.class_id}
              renderItem={({ item }) => (
                <View style={styles.classItem}>
                  <Checkbox
                    status={selectedClasses[item.class_id] ? 'checked' : 'unchecked'}
                    onPress={() => handleSelectClass(item.class_id)}
                  />
                  <Text style={styles.classItemText}>{item.class_id}</Text>
                  <Text style={styles.classItemText}>{item.class_name}</Text>
                  <Text style={styles.classItemText}>{formatDate(item.start_date)}</Text>
                  <Text style={styles.classItemText}>{formatDate(item.end_date)}</Text>
                  <Text style={styles.classItemText}>{item.status ?? item.status}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={{ marginTop: 'auto', fontSize: 16, fontWeight: 'bold', color: color.red }}>
              Sinh viên chưa đăng ký lớp
            </Text>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.submitButton} onPress={handleRegisterClasses}>
            <Text style={styles.buttonText}>Gửi đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleDeleteSelectedClasses}>
            <Text style={styles.buttonText}>Xóa lớp</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  submitButton: {
    backgroundColor: '#b30000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 6,
    marginRight: 10
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

export default RegisterClass;

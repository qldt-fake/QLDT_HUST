import React, { ReactElement } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView
} from 'react-native';
import ClassHeader from './ClassHeader';
import { color } from 'src/common/constants/color';
import { getBasicClassInfoApi, getClassApi, registerClassApi } from 'src/services/class.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { Checkbox } from 'react-native-paper';
import { formatDate, formatDateTime } from 'src/utils/helper';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ClassNavigationName } from 'src/common/constants/nameScreen';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { ClassNavigationType } from 'src/common/type/navigation';
import { convertClassStatus, convertRegisterClassStatus, DATE_TIME_FORMAT, FAILED, SUCCESS } from 'src/common/constants';
interface ClassItem {
  class_id: string;
  class_name: string;
  start_date: string;
  class_type: string;
  max_student_amount: number | string;
  end_date: string;
  registration_status?: keyof typeof convertRegisterClassStatus; // Khai báo kiểu rõ ràng
  status?: keyof typeof convertClassStatus; // Khai báo kiểu rõ ràng
}

const RegisterClass = () => {
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const dispatch = useAppDispatch();
  const [tempClassList, setTempClassList] = React.useState<ClassItem[]>([]); // Sửa kiểu cho tempClassList
  const [searchText, setSearchText] = React.useState<string>(''); // Kiểu cho searchText
  const [selectedClasses, setSelectedClasses] = React.useState<Record<string, boolean>>({}); // Kiểu cho selectedClasses
  const navigation: NavigationProp<ClassNavigationType> = useNavigation();
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
    if (!searchText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã lớp');
      return;
    }

    try {
      dispatch(showLoading()); // Hiển thị loading
      const response = await getBasicClassInfoApi({
        class_id: searchText,
        token: user?.token,
        role: user?.role,
        account_id: user?.id
      });
      if(response)
        switch (response.meta?.code) {
          case CODE_OK: 
          {
            const isClassAdded = tempClassList.some(item => item.class_id === response.data.class_id);

            if (!isClassAdded) {
              setTempClassList(prevList => [
                ...prevList,
                {
                  ...response.data,
                }
              ]);
            } else {
              Alert.alert('Thông báo', 'Lớp này đã có trong danh sách');
            }
          }
          break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout())
            break;
          case NOT_ACCESS: 
            Alert.alert('Lỗi', 'Không có quyền truy cập');
            break;
          default:
            Alert.alert('Lỗi', 'Không tìm thấy lớp');
            break;
          }
        } catch (error) {
          Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tìm kiếm lớp');
        } finally {
          dispatch(hideLoading());
        }
  };

  // Hàm đăng ký các lớp
  const handleRegisterClasses = async () => {
    try {
      const selectedClassIds = Object.keys(selectedClasses).filter(classId => selectedClasses[classId]);
      if (selectedClassIds.length === 0) {
        Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một lớp để đăng ký');
        return;
      }
  
      dispatch(showLoading()); // Hiển thị loading
      const response = await registerClassApi({
        token: user?.token,
        class_ids: selectedClassIds
      });
      console.log(response);
  
      if (response) {
        switch (response.meta?.code) {
          case CODE_OK: {
            const updatedStatusClass = response.data;
  
            // Phân loại trạng thái các lớp sau khi đăng ký
            const successClasses = updatedStatusClass
              .filter((cls: any) => cls.status == SUCCESS)
              .map((cls: any) => cls.class_id);
  
            const failedClasses = updatedStatusClass
              .filter((cls: any) => cls.status == FAILED)
              .map((cls: any) => cls.class_id);
  
            // Hiển thị thông báo kết quả
            const successMessage = successClasses.length
              ? `Các lớp đăng ký thành công: ${successClasses.join(', ')}`
              : '';
            const failedMessage = failedClasses.length
              ? `Các lớp đăng ký thất bại: ${failedClasses.join(', ')}`
              : '';
            const resultMessage = `${successMessage}\n${failedMessage}`.trim();
  
            Alert.alert('Kết quả đăng ký', resultMessage || 'Không có thông tin đăng ký lớp.');
  
            // Cập nhật danh sách trạng thái lớp
            setTempClassList(prevList =>
              prevList.map(item => {
                const updatedClass = updatedStatusClass.find(
                  (cls: ClassItem) => cls.class_id === item.class_id
                );
                return updatedClass ? { ...item, registration_status: updatedClass.status } : item;
              })
            );
            break;
          }
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Không có quyền truy cập');
            break;
          default:
            Alert.alert('Lỗi', response.meta?.message ?? 'Đã xảy ra lỗi khi đăng ký lớp');
            break;
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng ký lớp');
    } finally {
      dispatch(hideLoading());
    }
  };
  // TableCell component
  const TableCell = ({ width = 100, children } : any) => (
    <View
      style={{
        width,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  );

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
        {/* Table with Horizontal Scroll */}
        <ScrollView horizontal={true} style={styles.tableContainer}>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <TableCell width = {30}>
                <Text style={styles.tableHeaderText}></Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>STT</Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>Mã lớp</Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>Tên lớp</Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>Loại lớp</Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>Số lượng SV tối đa</Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>Ngày bắt đầu</Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>Ngày kết thúc</Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>Trạng thái lớp</Text>
              </TableCell>
              <TableCell>
                <Text style={styles.tableHeaderText}>Trạng thái ĐK</Text>
              </TableCell>
            </View>

            <ScrollView style={styles.classList}>
              {tempClassList.map((item: ClassItem, index) => (
                <View key={item.class_id} style={styles.classItem}>
                  <TableCell width={30}>
                    <Checkbox
                      status={selectedClasses[item.class_id] ? 'checked' : 'unchecked'}
                      onPress={() => handleSelectClass(item.class_id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>{index + 1}</Text>
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>{item.class_id}</Text>
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>{item.class_name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>{item.class_type}</Text>
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>{item.max_student_amount}</Text>
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>{formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH,new Date(item.start_date))}</Text>
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>{formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH, new Date(item.end_date))}</Text>
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>
                    {convertClassStatus[item.status as keyof typeof convertClassStatus] ?? ''}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text style={styles.classItemText}>{convertRegisterClassStatus[item.registration_status as keyof typeof convertRegisterClassStatus] ?? ''}</Text>
                  </TableCell>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.submitButton} onPress={handleRegisterClasses}>
            <Text style={styles.buttonText}>Gửi đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleDeleteSelectedClasses}>
            <Text style={styles.buttonText}>Xóa lớp</Text>
          </TouchableOpacity>
        </View>
        <Text
          onPress={() => navigation.navigate(ClassNavigationName.ClassListOpen as never)}
          style={styles.footerText}
        >
          Thông tin danh sách các lớp mở
        </Text>
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
  tableContainer: {},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#b30000',
    paddingVertical: 10,
    columnGap: 10,
    borderRadius: 5,
    width: '100%' // Đảm bảo header có độ rộng đầy đủ
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 14,
    width: "100%",
    textAlign: 'center'
  },
  classList: {
    borderWidth: 1,
    borderColor: '#b30000',
    borderRadius: 5,
    width: '100%',
    height: 250,
    marginBottom: 20,
    paddingVertical: 5,
    overflow: 'hidden'
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingVertical: 5,
    width: '100%' // Đảm bảo các item có độ rộng đầy đủ
  },
  classItemText: {
    color: '#b30000',
    width: "100%",
    textAlign: 'center'
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
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default RegisterClass;

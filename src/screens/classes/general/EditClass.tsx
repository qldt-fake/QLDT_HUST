import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { PaperProvider, RadioButton, Menu } from 'react-native-paper';
import DateTimePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { getClassApi, updateClassApi, IClassItem, getBasicClassInfoApi } from 'src/services/class.service';
import { classStatus, classType } from 'src/common/enum/commom';
import { calculateDateAfterWeeks, formatDateTime } from 'src/utils/helper';
import { DATE_TIME_FORMAT } from 'src/common/constants';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { color } from 'src/common/constants/color';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from 'src/redux';
import { useAlert } from '../../../hooks/useAlert';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { EditClassProps } from 'src/interfaces/class.interface';

const EditClass: React.FC<EditClassProps> = ({ route }) => {
  const { classId } = route.params;
  const { user } = useSelector(selectAuth);
  const [editClass, setEditClass] = useState<IClassItem>({
    class_id: '',
    class_name: '',
    class_type: '',
    status: '',
    max_student_amount: 0,
    start_date: null,
    end_date: null,
    token: user?.token
  });

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [selectedPeriod, setSelectedPeriod] = useState<'start_date' | 'end_date'>('start_date');
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const {showAlert} = useAlert();

  const handleChange = (name: string, value: any) => {
    setEditClass(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowDatePicker = (type: 'start_date' | 'end_date') => {
    setSelectedPeriod(type);
    setIsOpenDatePicker(true);
  };

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        dispatch(showLoading());
        const res = await getBasicClassInfoApi({
          token: user?.token,
          role: user?.role,
          class_id: classId,
          account_id: user?.id
        });
        dispatch(hideLoading());
        if(res && res.data) {
          switch (res.meta?.code) {
            case CODE_OK:
              setEditClass({
                class_id: res.data.class_id,
                class_name: res.data.class_name,
                // class_type: res.data.class_type,
                status: res.data.status,
                max_student_amount: res.data.max_student_amount,
                start_date: new Date(res.data.start_date),
                end_date: new Date(res.data.end_date)
              });
              break;
            case INVALID_TOKEN:
              Alert.alert('Lỗi', 'Token không hợp lệ');
              dispatch(logout());
              break;
            case NOT_ACCESS:
              Alert.alert('Lỗi', 'Role của bạn không có quyền sửa lớp.');
              break;
            default:
              Alert.alert('Lỗi', res.data);
              break; 
          }
        }

      } catch (error) {
        console.error('Something went wrong', error);
      }
    };
    fetchClassInfo();
  }, [classId, user?.token, user?.role, user?.id]);

  const validateClass = () => {
    if (!editClass.class_name) {
      Alert.alert('Lỗi', 'Tên lớp không được để trống.');
      return false;
    }
    if (editClass.class_name.length > 50) {
      Alert.alert('Lỗi', 'Tên lớp không được dài quá 50 ký tự.');
      return false;
    }
    if ((editClass.max_student_amount ?? 0) < 1 || (editClass.max_student_amount ?? 0) > 50) {
      Alert.alert('Lỗi', 'Số lượng sinh viên tối đa phải trong khoảng từ 1 đến 50.');
      return false;
    }
    if (!editClass.start_date || !editClass.end_date) {
      Alert.alert('Validation Error', 'Ngày bắt đầu và ngày kết thúc không được để trống.');
      return false;
    }
    if (dayjs(editClass.end_date).isBefore(dayjs(editClass.start_date))) {
      Alert.alert('Validation Error', 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.');
      return false;
    }
    return true;
  };

  const handleUpdateClass = async () => {
    if (!validateClass()) return;

    try {
      const requestClass = {
        ...editClass,
        start_date: dayjs(editClass.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(editClass.end_date).format('YYYY-MM-DD'),
        token: user?.token
      };
      console.log("Request Class",requestClass);
      dispatch(showLoading());
      const res = await updateClassApi(requestClass);
      console.log("Response",res);
      if (res) {
        switch (res.meta?.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Chỉnh sửa lớp thành công.');
            navigation.goBack();
            break;
          case INVALID_TOKEN:
            Alert.alert('Thất bại', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Thất bại', 'Role của bạn không có quyền sửa lớp.');
            break;
          default:
            Alert.alert('Thất bại', res.meta?.message ?? 'Có lỗi xảy ra');
            break;
        }
      }
    } catch {
      Alert.alert('Thất bại', 'Hiện không thể chỉnh sửa lớp.');
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleMenuSelect = (option: '16' | '17' | 'Custom') => {
    setMenuVisible(false);

    if (!editClass.start_date) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày bắt đầu trước.');
      return;
    }

    if (option === 'Custom') {
      handleShowDatePicker('end_date');
    } else {
      const weeks = parseInt(option, 10);
      handleChange('end_date', calculateDateAfterWeeks(editClass.start_date as Date, weeks));
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.body}>
          <TextInput
            style={styles.input}
            placeholder='Mã lớp *'
            value={editClass.class_id as string}
            onChangeText={text => handleChange('class_id', text)}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder='Tên lớp *'
            value={editClass.class_name}
            onChangeText={text => handleChange('class_name', text)}
          />

          {/* <Text style={styles.label}>Loại lớp</Text>
          <RadioButton.Group
            onValueChange={value => handleChange('class_type', value)}
            value={editClass.class_type as string}
          >
            <View style={styles.row}>
              {Object.entries(classType).map(([key, value]) => (
                <View key={key} style={styles.radioButton}>
                  <RadioButton value={value} color={color.borderRed} />
                  <Text>{value}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group> */}

          <Text style={styles.label}>Trạng thái</Text>
          <RadioButton.Group
            onValueChange={value => handleChange('status', value)}
            value={editClass.status as string}
          >
            <View style={styles.row}>
              {Object.entries(classStatus).map(([key, value]) => (
                <View key={key} style={styles.radioButton}>
                  <RadioButton value={value} color={color.borderRed} />
                  <Text>{value}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>

          {isOpenDatePicker && (
            <DateTimePicker
              date={
                editClass[selectedPeriod] instanceof Date ? editClass[selectedPeriod] as Date : new Date()
              }
              onConfirm={date => {
                setIsOpenDatePicker(false);
                handleChange(selectedPeriod, date);
              }}
              onCancel={() => setIsOpenDatePicker(false)}
              mode='date'
              androidVariant='nativeAndroid'
              textColor={color.submitBtnRed}
              modal
              open
            />
          )}

          <View style={styles.period}>
            <TouchableOpacity
              style={styles.selectPeriod}
              onPress={() => handleShowDatePicker('start_date')}
            >
              <Text style={styles.selectText}>
                {editClass.start_date
                  ? formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH, editClass.start_date as Date)
                  : 'Bắt đầu'}
              </Text>
              <Icon name='caret-down' size={20} color={color.borderRed} />
            </TouchableOpacity>

            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity style={styles.selectPeriod} onPress={() => setMenuVisible(true)}>
                  <Text style={styles.selectText}>
                    {editClass.end_date
                      ? formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH, editClass.end_date as Date)
                      : 'Kết thúc'}
                  </Text>
                  <Icon name='caret-down' size={20} color={color.borderRed} />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => handleMenuSelect('16')} title='16 tuần' />
              <Menu.Item onPress={() => handleMenuSelect('17')} title='17 tuần' />
              <Menu.Item onPress={() => handleMenuSelect('Custom')} title='Tùy chọn' />
            </Menu>
          </View>

          <TextInput
            style={styles.input}
            placeholder='Số lượng sinh viên tối đa *'
            keyboardType='numeric'
            value={
              editClass.max_student_amount?.toString()
            }
            onChangeText={text => {
              const value = parseInt(text, 10);
              handleChange('max_student_amount', isNaN(value) ? 0 : value);
            }}
          />

          <TouchableOpacity style={styles.submitButton} onPress={()=>  showAlert('Update Class', 'Are you sure to update this class?', handleUpdateClass)}>
            <Text style={styles.submitButtonText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footerText}>Thông tin danh sách các lớp mở</Text>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: color.borderRed,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f2f2f2'
  },
  label: { color: color.borderRed, marginBottom: 10 },
  row: { flexDirection: 'row', marginBottom: 15 },
  radioButton: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  period: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 20 },
  selectPeriod: {
    borderColor: color.borderRed,
    borderWidth: 1,
    borderRadius: 10,
    width: 150,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row'
  },
  selectText: { fontWeight: '500', color: '#333' },
  submitButton: {
    backgroundColor: color.submitBtnRed,
    borderRadius: 10,
    alignItems: 'center',
    padding: 15
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  footerText: { textAlign: 'center', marginTop: 20, color: '#aaa' }
});

export default EditClass;

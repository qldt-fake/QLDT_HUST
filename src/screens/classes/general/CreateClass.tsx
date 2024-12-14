import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { PaperProvider, RadioButton, Menu } from 'react-native-paper';
import DateTimePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { createClassApi, IClassItem } from 'src/services/class.service';
import { classType } from 'src/common/enum/commom';
import { calculateDateAfterWeeks, formatDateTime } from 'src/utils/helper';
import { DATE_TIME_FORMAT } from 'src/common/constants';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { color } from 'src/common/constants/color';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS, PARAM_VALUE_INVALID } from 'src/common/constants/responseCode';
import { useAppDispatch } from 'src/redux';
import { useNavigation } from '@react-navigation/native';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';

const CreateClass = () => {
  const { user } = useSelector(selectAuth);
  const [newClass, setNewClass] = useState({
    class_id: '',
    class_name: '',
    class_type: '',
    // status: '',
    max_student_amount: 0,
    start_date: null,
    end_date: null,
    token: user?.token
  });

  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const [selectedPeriod, setSelectedPeriod] = useState<'start_date' | 'end_date'>('start_date');
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleChange = (name: string, value: any) => {
    setNewClass(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateClass = () => {
    if (!newClass.class_id || !newClass.class_name) {
      Alert.alert('Validation Error', 'Mã lớp và tên lớp không được để trống.');
      return false;
    }
    if (newClass.class_id.length != 6) {
      Alert.alert('Validation Error', 'Mã lớp phải có 6 ký tự.');
      return false;
    }
    if (newClass.class_name.length > 50) {
      Alert.alert('Validation Error', 'Tên lớp không được dài quá 50 ký tự.');
      return false;
    }
    if (newClass.max_student_amount < 1 || newClass.max_student_amount > 50) {
      Alert.alert('Validation Error', 'Số lượng sinh viên tối đa phải trong khoảng từ 1 đến 50.');
      return false;
    }
    if (!newClass.start_date || !newClass.end_date) {
      Alert.alert('Validation Error', 'Ngày bắt đầu và ngày kết thúc không được để trống.');
      return false;
    }
    if (dayjs(newClass.end_date).isBefore(dayjs(newClass.start_date))) {
      Alert.alert('Validation Error', 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.');
      return false;
    }
    return true;
  };

  const handleCreateClass = async () => {
    if (!validateClass()) return;

    try {
      const requestClass: IClassItem = {
        ...newClass,
        start_date: dayjs(newClass.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(newClass.end_date).format('YYYY-MM-DD')
      };
      dispatch(showLoading());
      const res = await createClassApi(requestClass);
      console.log('res', res);
      if (res) {
        switch (res.meta?.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Tạo lớp thành công.');
            navigation.goBack();
            break;
          case INVALID_TOKEN:
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Thất bại', 'Role của bạn không có quyền tạo lớp.');
            break;
          case PARAM_VALUE_INVALID:
            Alert.alert('Thất bại', typeof res.data === 'string' ? res.data : 'Dữ liệu không hợp lệ.');
            break;
          default:
            Alert.alert('Thất bại', res.meta?.message ?? 'Hiện không thể tạo lớp.');
            break;
        }
      }
    } catch {
      Alert.alert('Thất bại', 'Hiện không thể tạo lớp.');
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleShowDatePicker = (type: 'start_date' | 'end_date') => {
    setSelectedPeriod(type);
    setIsOpenDatePicker(true);
  };

  const handleMenuSelect = (option: '16' | '17' | 'Custom') => {
    setMenuVisible(false);

    if (!newClass.start_date) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày bắt đầu trước.');
      return;
    }

    if (option === 'Custom') {
      handleShowDatePicker('end_date');
    } else {
      const weeks = parseInt(option, 10);
      handleChange('end_date', calculateDateAfterWeeks(newClass.start_date as Date, weeks));
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.body}>
          <TextInput
            style={styles.input}
            value={newClass.class_id}
            placeholder='Mã lớp *'
            onChangeText={text => handleChange('class_id', text)}
          />
          <TextInput
            style={styles.input}
            value={newClass.class_name}
            placeholder='Tên lớp *'
            onChangeText={text => handleChange('class_name', text)}
          />

          <Text style={styles.label}>Loại lớp</Text>
          <RadioButton.Group
            onValueChange={value => handleChange('class_type', value)}
            value={newClass.class_type}
          >
            <View style={styles.row}>
              {Object.entries(classType).map(([key, value]) => (
                <View key={key} style={styles.radioButton}>
                  <RadioButton value={value} color={color.borderRed} />
                  <Text>{value}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>

          {/* <Text style={styles.label}>Trạng thái</Text>
          <RadioButton.Group
            onValueChange={value => handleChange('status', value)}
            value={newClass.status}
          >
            <View style={styles.row}>
              {Object.entries(classStatus).map(([key, value]) => (
                <View key={key} style={styles.radioButton}>
                  <RadioButton value={value} color={color.borderRed} />
                  <Text>{value}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group> */}

          {isOpenDatePicker && (
            <DateTimePicker
              date={newClass[selectedPeriod] ?? new Date()}
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
                {newClass.start_date
                  ? formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH, newClass.start_date)
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
                    {newClass.end_date
                      ? formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH, newClass.end_date)
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
            onChangeText={text => {
              const value = parseInt(text, 10);
              handleChange('max_student_amount', isNaN(value) ? 0 : value);
            }}
            value={newClass.max_student_amount.toString()}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleCreateClass}>
            <Text style={styles.submitButtonText}>Tạo</Text>
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

export default CreateClass;

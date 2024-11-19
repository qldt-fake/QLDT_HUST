import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import { color } from 'src/common/constants/color';
import ClassHeader from './ClassHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-date-picker';
import { createClassApi } from 'src/services/class.service';
import { IClassItem } from 'src/services/class.service';
import { classType } from 'src/common/enum/commom';
import { useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import { selectAuth } from 'src/redux/slices/authSlice';

const CreateClass = () => {
  const auth = useSelector(selectAuth)
  const user = auth.user
  const [newClass, setNewClass] = useState<IClassItem>({
    class_id: '',
    class_name: '',
    class_type: classType.LT,
    max_student_amount: 0,
    start_date: null,
    end_date: null,
    token: user?.token
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'start_date' | 'end_date'>('start_date');
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  const handleChange = (name: string, value: string | object | Date) => {
    setNewClass(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowDatePicker = (type: 'start_date' | 'end_date') => {
    setIsOpenDatePicker(true);
    setSelectedPeriod(type);
  };

  const validateClass = () => {
    if (!newClass.class_id) {
      Alert.alert('Validation Error', 'Class ID cannot be null');
      return false;
    }
    if (!newClass.class_name) {
      Alert.alert('Validation Error', 'Class name cannot be null');
      return false;
    }
    if (newClass.class_name.length > 50) {
      Alert.alert('Validation Error', 'Class name length must be less than 50');
      return false;
    }
    if (
      newClass.max_student_amount !== null &&
      (newClass.max_student_amount! < 1 || newClass.max_student_amount! > 50)
    ) {
      Alert.alert('Validation Error', 'Max student amount must be between 1 and 50');
      return false;
    }
    return true;
  };

  const handleCreateClass = async () => {
    if (!validateClass()) {
      return;
    }
    try {
      const requestClass = {
        ...newClass,
        start_date: dayjs(newClass.start_date as Date).format('YYYY-MM-DD'),
        end_date: dayjs(newClass.end_date as Date).format('YYYY-MM-DD')
      };
      console.log(requestClass);
      const res = await createClassApi(requestClass);
      console.log(res);
      Alert.alert('Success', `Class created with code: ${res.meta.message}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create class');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder='Mã lớp *'
          onChangeText={text => handleChange('class_id', text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Tên lớp *'
          onChangeText={text => handleChange('class_name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Loại lớp *'
          onChangeText={text => handleChange('class_type', text)}
        />
        {isOpenDatePicker && (
          <DateTimePicker
            date={newClass[selectedPeriod] as Date ?? new Date()}
            onConfirm={date => {
              setIsOpenDatePicker(false);
              handleChange(selectedPeriod, date);
            }}
            onCancel={() => setIsOpenDatePicker(false)}
            mode='datetime'
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
            <Text style={{ color: color.borderRed }}>
              {newClass.start_date ? newClass.start_date.toLocaleString() : 'Bắt đầu'}
            </Text>
            <Icon name='caret-down' size={20} color={color.borderRed} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectPeriod}
            onPress={() => handleShowDatePicker('end_date')}
          >
            <Text style={{ color: color.borderRed }}>
              {newClass.end_date ? newClass.end_date.toLocaleString() : 'Kết thúc'}
            </Text>
            <Icon name='caret-down' size={20} color={color.borderRed} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder='Số lượng sinh viên tối đa *'
          keyboardType='numeric'
          onChangeText={text => {
            const parsedValue = parseInt(text, 10);
            handleChange('max_student_amount', isNaN(parsedValue) ? '' : parsedValue.toString());
          }}        />
        <TouchableOpacity style={styles.submitButton} onPress={handleCreateClass}>
          <Text style={[styles.text, styles.submitButtonText]}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>Thông tin danh sách các lớp mở</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  body: {
    padding: 30
  },
  input: {
    borderWidth: 1,
    borderColor: color.borderRed,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f2f2f2'
  },
  text: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  period: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20
  },
  selectPeriod: {
    borderColor: color.borderRed,
    borderWidth: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    flex: 1,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row'
  },
  submitButton: {
    backgroundColor: color.submitBtnRed,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 110,
    height: 50,
    justifyContent: 'center'
  },
  submitButtonText: {
    textAlign: 'center'
  },
  footerText: {
    color: color.borderRed,
    textDecorationLine: 'underline',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 24,
    paddingHorizontal: 25
  }
});

export default CreateClass;

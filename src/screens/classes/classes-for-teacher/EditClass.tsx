import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { color } from 'src/common/constants/color';
import ClassHeader from './ClassHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-date-picker';
import { getClassApi, IClassItem, updateClassApi } from 'src/services/class.service';
import { at, set } from 'lodash';
import { ReponseCode } from 'src/common/enum/reponseCode';
const EditClass = ({ classId }) => {
  const [editClass, setEditClass] = useState<IClassItem>({});
  const [selectedPeriod, setSelectedPeriod] = useState<'start_date' | 'end_date'>('start_date');
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  const handleChange = (name: string, value: string | object | Date) => {
    setEditClass(prev => ({ ...prev, [name]: value }));
  };

  const handleShowDatePicker = (type: 'start_date' | 'end_date') => {
    setIsOpenDatePicker(true);
    setSelectedPeriod(type);
  };

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const res = await getClassApi({
          token: '93fxxl',
          role: 'LECTURER',
          class_id: classId,
          account_id: '245'
        });
        if (res && res.data) {
          const data = res.data;
          console.log(data);
          setEditClass({
            class_id: data.class_id || '',
            attached_code: data.attached_code || '',
            class_name: data.class_name || '',
            class_type: data.class_type || '',
            start_date: data.start_date ? new Date(data.start_date) : null,
            end_date: data.end_date ? new Date(data.end_date) : null,
            max_student_amount: data.student_count ?? null
          });
        }
      } catch (error) {
        console.error('Something went wrong', error);
      }
    };
    fetchClassInfo();
  }, [classId]);

  const handleUpdateClass = async () => {
    try {
      const res = await updateClassApi({
        token: '93fxxl',
        role: 'LECTURER',
        class_id: classId,
        account_id: '245',
        ...editClass
      });
      if(res && res.data && res.meta.code==ReponseCode.CODE_OK) {
        Alert.alert('Success', 'Update class successfully');
      }
    } catch (error) {
      console.error('Something went wrong', error);
    }
  }

  return (
    <View style={styles.container}>
      <ClassHeader title='Edit class' />
      <View style={styles.body}>
        <TextInput
          value={editClass.class_id}
          onChangeText={text => handleChange('class_id', text)}
          style={styles.input}
          placeholder='Mã lớp *'
        />
        <TextInput
          value={editClass.attached_code}
          onChangeText={text => handleChange('attached_code', text)}
          style={styles.input}
          placeholder='Mã lớp kèm *'
        />
        <TextInput
          value={editClass.class_name}
          onChangeText={text => handleChange('class_name', text)}
          style={styles.input}
          placeholder='Tên lớp *'
        />
        <TextInput
          value={editClass.class_type}
          onChangeText={text => handleChange('class_type', text)}
          style={styles.input}
          placeholder='Loại lớp *'
        />

        {isOpenDatePicker && (
          <DateTimePicker
            date={editClass[selectedPeriod] ?? new Date()}
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
              {editClass.start_date ? editClass.start_date.toLocaleString() : 'Bắt đầu'}
            </Text>
            <Icon name='caret-down' size={20} color={color.borderRed} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectPeriod}
            onPress={() => handleShowDatePicker('end_date')}
          >
            <Text style={{ color: color.borderRed }}>
              {editClass.end_date ? editClass.end_date.toLocaleString() : 'Kết thúc'}
            </Text>
            <Icon name='caret-down' size={20} color={color.borderRed} />
          </TouchableOpacity>
        </View>

        <TextInput
          value={String(editClass.max_student_amount ?? '')}
          onChangeText={text => handleChange('max_student_amount', parseInt(text) || null)}
          style={styles.input}
          placeholder='Số lượng sinh viên tối đa *'
          keyboardType='numeric'
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', columnGap: 10 }}>
          <TouchableOpacity style={[styles.submitButton, { flex: 6 }]}>
            <Text style={[styles.text, styles.submitButtonText]}>Xóa lớp học</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.submitButton, { flex: 4 }]} onPress={handleUpdateClass}>
            <Text style={[styles.text, styles.submitButtonText]}>Xác nhận</Text>
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

export default EditClass;
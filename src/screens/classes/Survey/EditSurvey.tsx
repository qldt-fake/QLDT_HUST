import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Alert,
  Linking
} from 'react-native';
import ClassHeader from '../general/ClassHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import DateTimePicker from 'react-native-date-picker';
import { color } from 'src/common/constants/color';
import { createSurveyApi, editSurveyApi } from 'src/services/survey.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { IEditSurveyProps, ISurveyPayload } from 'src/interfaces/survey.interface';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { useNavigation } from '@react-navigation/native';
import { selectFile } from 'src/utils/helper';

const EditSurvey: React.FC<IEditSurveyProps> = ({ route }: any) => {
  const { file_url, title, description, deadline, id, classId } = route?.params || {};
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const [editSurvey, setNewSurvey] = useState<ISurveyPayload>({
    title: title,
    description: description,
    file_url: file_url,
    file: null,
    deadline: deadline,
    id: id
  });
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  const handleChange = (name: keyof ISurveyPayload, value: string | object | Date | null | any) => {
    setNewSurvey(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowDatePicker = () => {
    setIsOpenDatePicker(true);
  };

  const handleViewSurvey = () => {
    if (file_url) {
      Linking.openURL(file_url);
    }
  };

  const handleSelectFile = async () => {
    const file = await selectFile();
    if (file) {
      handleChange('file', file);
    }
  };

  const validate = () => {
    // Kiểm tra nếu tên bài kiểm tra không được nhập
    // if (!editSurvey.title?.trim()) {
    //   Alert.alert('Lỗi', 'Tên bài kiểm tra là trường bắt buộc');
    //   return false;
    // }

    // Kiểm tra nếu không có mô tả hoặc tài liệu được tải lên
    if (!editSurvey.description?.trim() && !editSurvey.file) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả hoặc tải tài liệu lên');
      return false;
    }

    // Giới hạn ký tự cho phần mô tả (ví dụ: tối đa 500 ký tự)
    const MAX_DESCRIPTION_LENGTH = 500;
    if ((editSurvey.description?.trim().length ?? 0) > MAX_DESCRIPTION_LENGTH) {
      Alert.alert('Lỗi', `Mô tả không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự`);
      return false;
    }

    // Kiểm tra thời gian bắt đầu và thời gian kết thúc
    const currentTime = new Date();
    if (editSurvey.deadline && editSurvey.deadline <= currentTime) {
      Alert.alert('Lỗi', 'Thời gian kết thúc phải lớn hơn thời gian hiện tại');
      return false;
    }

    if (!editSurvey.deadline || isNaN((editSurvey.deadline as Date).getTime())) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày hợp lệ');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      const payload = {
        token: user?.token, // Replace with actual token
        // classId: classId, 
        // title: editSurvey.title,
        description: editSurvey.description,
        deadline: dayjs(editSurvey.deadline).format('YYYY-MM-DDTHH:mm:ss'),
        file: editSurvey.file,
        id: editSurvey.id
      };
      dispatch(showLoading());
      const response = await editSurveyApi(payload);
      console.log('response', response);
      if(response) {
        switch (response.meta?.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Sủa bài kiểm tra thành công');
            navigation.goBack();
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền tạo bài kiểm tra');
            break;
          default:
            Alert.alert('Lỗi', response?.meta?.message ?? 'Có lỗi xảy ra với server');
            break;
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create survey');
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <View style={styles.container}>
      <ClassHeader title='Create Survey' />
      <View style={styles.body}>
        <TextInput
          style={styles.name}
          value={editSurvey.title as string}
          onChangeText={text => handleChange('title', text)}
          placeholder='Survey Title *'
          placeholderTextColor={color.submitBtnRed}
          editable={false}
        />
        {file_url && (
          <TouchableOpacity style={styles.viewButton} onPress={handleViewSurvey}>
            <Text style={[styles.text, styles.viewButtonText]}>Mở file bài kiểm tra</Text>
          </TouchableOpacity>
        )}
        <TextInput
          style={[styles.name, styles.description]}
          value={editSurvey.description as string}
          onChangeText={text => handleChange('description', text)}
          placeholder='Description'
          multiline
          numberOfLines={6}
          placeholderTextColor={color.submitBtnRed}
        />

        <TouchableHighlight style={styles.fileButton} onPress={handleSelectFile}>
          <>
            <Text
              style={[styles.text, styles.fileButtonText]}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {editSurvey?.file ? editSurvey.file.name : 'Upload File'}
            </Text>
            <Icon name='caret-up' size={20} color='#fff' />
          </>
        </TouchableHighlight>
        {isOpenDatePicker && (
          <DateTimePicker
            date={new Date(editSurvey.deadline as string) ?? new Date()}
            onConfirm={date => {
              setIsOpenDatePicker(false);
              handleChange('deadline', date);
            }}
            onCancel={() => setIsOpenDatePicker(false)}
            mode='datetime'
            androidVariant='nativeAndroid'
            textColor={color.red}
            modal
            open
          />
        )}
        <View style={styles.period}>
          <TouchableOpacity style={styles.selectPeriod} onPress={handleShowDatePicker}>
            <Text style={{ color: color.borderRed }}>
              {editSurvey.deadline ? editSurvey.deadline.toLocaleString() : 'Deadline'}
            </Text>
            <Icon name='caret-down' size={20} color={color.borderRed} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={[styles.text, styles.submitButtonText]}>Sửa</Text>
        </TouchableOpacity>
      </View>
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
  name: {
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
  description: {
    height: 200,
    textAlignVertical: 'top'
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: color.borderRed
  },
  fileButton: {
    backgroundColor: color.borderRed,
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 60,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  fileButtonText: {
    textAlign: 'center',
    maxWidth: '80%'
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
    backgroundColor: color.red,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 110,
    height: 50,
    justifyContent: 'center'
  },
  submitButtonText: {
    textAlign: 'center'
  },
  viewButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewButtonText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    color: color.red,
    fontSize: 20
  }
});

export default EditSurvey;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Alert
} from 'react-native';
import ClassHeader from '../general/ClassHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import DateTimePicker from 'react-native-date-picker';
import { color } from 'src/common/constants/color';
import { createSurveyApi } from 'src/services/survey.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
interface NewSurvey {
  title: string;
  description: string;
  file: any;
  deadline: Date | null;
}

const EditSurvey: React.FC<any> = (args: { route: any }) => {
  const { route } = args;
  const { classId, survey_id } = route.params;
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const [newSurvey, setNewSurvey] = useState<NewSurvey>({
    title: '',
    description: '',
    file: null,
    deadline: null
  });

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  const handleChange = (name: keyof NewSurvey, value: string | object | Date | null | any) => {
    setNewSurvey(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowDatePicker = () => {
    setIsOpenDatePicker(true);
  };

  const handleSelectFile = async () => {
    try {
      const res: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.plainText,
          DocumentPicker.types.zip,
          DocumentPicker.types.audio,
          DocumentPicker.types.video
        ]
      });

      const file = res[0];
      handleChange('file', file);
      console.log('file', file);

      console.log(file);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log(err);
      }
    }
  };

  const validate = () => {
    // Kiểm tra nếu tên bài kiểm tra không được nhập
    if (!newSurvey.title.trim()) {
      Alert.alert('Lỗi', 'Tên bài kiểm tra là trường bắt buộc');
      return false;
    }

    // Kiểm tra nếu không có mô tả hoặc tài liệu được tải lên
    if (!newSurvey.description.trim() && !newSurvey.file) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả hoặc tải tài liệu lên');
      return false;
    }

    // Giới hạn ký tự cho phần mô tả (ví dụ: tối đa 500 ký tự)
    const MAX_DESCRIPTION_LENGTH = 500;
    if (newSurvey.description.length > MAX_DESCRIPTION_LENGTH) {
      Alert.alert('Lỗi', `Mô tả không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự`);
      return false;
    }

    // Kiểm tra thời gian bắt đầu và thời gian kết thúc
    const currentTime = new Date();
    if (newSurvey.deadline && newSurvey.deadline <= currentTime) {
      Alert.alert('Lỗi', 'Thời gian kết thúc phải lớn hơn thời gian hiện tại');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      if (!newSurvey.title || !newSurvey.deadline) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const payload = {
        token: user?.token, // Replace with actual token
        classId: classId, // Replace with actual classId
        title: newSurvey.title,
        description: newSurvey.description,
        deadline: dayjs(newSurvey.deadline).format('YYYY-MM-DDTHH:mm:ss'),
        file: newSurvey.file
      };

      console.log('file', newSurvey.file);

      const response = await createSurveyApi(payload);
      if (response && response.data && response.meta.code === ReponseCode.CODE_OK) {
        Alert.alert('Success', 'Survey created successfully');
        // Reset form or navigate away
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create survey');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ClassHeader title='Create Survey' />
      <View style={styles.body}>
        <TextInput
          style={styles.name}
          value={newSurvey.title}
          onChangeText={text => handleChange('title', text)}
          placeholder='Survey Title *'
          placeholderTextColor={color.submitBtnRed}
        />
        <TextInput
          style={[styles.name, styles.description]}
          value={newSurvey.description}
          onChangeText={text => handleChange('description', text)}
          placeholder='Description'
          multiline
          numberOfLines={6}
          placeholderTextColor={color.submitBtnRed}
        />
        <Text style={[styles.text, styles.orText]}>Or</Text>

        <TouchableHighlight style={styles.fileButton} onPress={handleSelectFile}>
          <>
            <Text
              style={[styles.text, styles.fileButtonText]}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {newSurvey?.file ? newSurvey.file.name : 'Upload File'}
            </Text>
            <Icon name='caret-up' size={20} color='#fff' />
          </>
        </TouchableHighlight>
        {isOpenDatePicker && (
          <DateTimePicker
            date={newSurvey.deadline ?? new Date()}
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
              {newSurvey.deadline ? newSurvey.deadline.toLocaleString() : 'Deadline'}
            </Text>
            <Icon name='caret-down' size={20} color={color.borderRed} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={[styles.text, styles.submitButtonText]}>Submit</Text>
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
  }
});

export default EditSurvey;

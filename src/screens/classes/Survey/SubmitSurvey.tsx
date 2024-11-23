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
import DateTimePicker from 'react-native-date-picker';
import { color } from 'src/common/constants/color';
import { submitSurveyApi } from 'src/services/survey.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { useSelector } from 'react-redux';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { selectFile } from 'src/utils/helper';
import { ACTION_DONE_PREVIOUS, CODE_OK, INVALID_TOKEN, NOT_ACCESS} from 'src/common/constants/responseCode';
import { useAppDispatch } from 'src/redux';
import { useNavigation } from '@react-navigation/native';
import {
  ISubmitSurveyPayload,
  ISurveyPayload,
  ISubmitSurveyProps
} from 'src/interfaces/survey.interface';

const SubmitSurvey: React.FC<ISubmitSurveyProps> = ({ route }) => {
  const { file_url, title, description, deadline, id } = route?.params || {};

  const auth = useSelector(selectAuth);
  const user = auth.user;

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [newSubmit, setNewSubmit] = useState<ISubmitSurveyPayload>({
    file: null,
    token: user?.token,
    assignmentId: id,
    textResponse: ''
  });

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  const handleChange = (
    name: keyof ISubmitSurveyPayload,
    value: string | object | Date | null | any
  ) => {
    setNewSubmit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowDatePicker = () => {
    setIsOpenDatePicker(true);
  };

  const handleSelectFile = async () => {
    const file = await selectFile();
    if (file) {
      handleChange('file', file);
    }
  };

  const handleViewSurvey = () => {
    if (file_url) {
      Linking.openURL(file_url);
    }
  };

  const validate = () => {
    if (!newSubmit.file && !newSubmit.textResponse) {
      Alert.alert('Error', 'Please fill at least one field');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    console.log('Submit', newSubmit);

    try {
      const payload = {
        ...newSubmit
      };

      const res = await submitSurveyApi(payload);
      if (res) {
        switch (res.meta.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Nộp survey thành công');
            navigation.goBack();
            break;
          case INVALID_TOKEN:
            Alert.alert('Error', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Error', 'You do not have permission to submit survey');
            break;
          case ACTION_DONE_PREVIOUS:
            Alert.alert('Error', 'You have already submitted this survey');
            break;
          default:
            Alert.alert('Error', res.data);
            break;
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create survey');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TextInput
          style={styles.name}
          value={title}
          placeholderTextColor={color.submitBtnRed}
          editable={false}
        />
        {file_url && (
          <TouchableOpacity style={styles.viewButton} onPress={handleViewSurvey}>
            <Text style={[styles.text, styles.viewButtonText]}>Open Survey</Text>
          </TouchableOpacity>
        )}
        {description && (
          <TextInput
            style={[styles.name, styles.description]}
            value={description}
            multiline
            numberOfLines={2}
            placeholderTextColor={color.submitBtnRed}
            editable={false}
          />
        )}

        <TextInput
          style={[styles.name, styles.description, { height: 150 }]}
          value={newSubmit.textResponse || ''}
          placeholder='Nhập mô tả'
          onChangeText={text => handleChange('textResponse', text)}
          multiline
          numberOfLines={3}
          placeholderTextColor={color.submitBtnRed}
        />

        <TouchableHighlight style={styles.fileButton} onPress={handleSelectFile}>
          <>
            <Text
              style={[styles.text, styles.fileButtonText]}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {newSubmit?.file ? newSubmit.file.name : 'Upload File'}
            </Text>
            <Icon name='caret-up' size={20} color='#fff' />
          </>
        </TouchableHighlight>

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
    height: 100,
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
    textAlign: 'center',
    color: color.red,
    fontSize: 20
  }
});

export default SubmitSurvey;

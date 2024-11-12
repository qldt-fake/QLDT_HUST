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
import ClassHeader from './ClassHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import DateTimePicker from 'react-native-date-picker';
import color from 'src/common/constants/color';
import { createSurveyApi } from 'src/services/survey.service';

interface NewSurvey {
  title: string;
  description: string;
  file: { uri: string; name: string; type: string } | null;
  deadline: Date | null;
}

const CreateSurvey: React.FC = () => {
  const [newSurvey, setNewSurvey] = useState<NewSurvey>({
    title: '',
    description: '',
    file: null,
    deadline: null
  });

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  const handleChange = (name: keyof NewSurvey, value: string | object | Date | null) => {
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
      handleChange('file', {
        uri: file.uri,
        name: file.name,
        type: file.type
      });

      console.log(file);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (!newSurvey.title || !newSurvey.deadline) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const payload = {
        token: '93fxxl', // Replace with actual token
        role: 'LECTURER', // Replace with actual role
        classId: 'YOUR_CLASS_ID', // Replace with actual classId
        title: newSurvey.title,
        description: newSurvey.description,
        deadline: newSurvey.deadline.toISOString(),
        file: newSurvey.file
      };

      const response = await createSurveyApi(payload);
      if (response.success) {
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
      <ClassHeader title="Create Survey" />
      <View style={styles.body}>
        <TextInput
          style={styles.name}
          value={newSurvey.title}
          onChangeText={text => handleChange('title', text)}
          placeholder="Survey Title *"
          placeholderTextColor={color.textSubmit}
        />
        <TextInput
          style={[styles.name, styles.description]}
          value={newSurvey.description}
          onChangeText={text => handleChange('description', text)}
          placeholder="Description"
          multiline
          numberOfLines={6}
          placeholderTextColor={color.textSubmit}
        />
        <Text style={[styles.text, styles.orText]}>Or</Text>

        <TouchableHighlight style={styles.fileButton} onPress={handleSelectFile}>
          <>
            <Text
              style={[styles.text, styles.fileButtonText]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {newSurvey?.file ? newSurvey.file.name : 'Upload File'}
            </Text>
            <Icon name="caret-up" size={20} color="#fff" />
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
            mode="datetime"
            androidVariant="nativeAndroid"
            textColor={color.textSubmit}
            modal
            open
          />
        )}
        <View style={styles.period}>
          <TouchableOpacity style={styles.selectPeriod} onPress={handleShowDatePicker}>
            <Text style={{ color: color.borderRed }}>
              {newSurvey.deadline ? newSurvey.deadline.toLocaleString() : 'Deadline'}
            </Text>
            <Icon name="caret-down" size={20} color={color.borderRed} />
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
    backgroundColor: color.textSubmit,
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

export default CreateSurvey;
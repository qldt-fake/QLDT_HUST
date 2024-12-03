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
import { color } from 'src/common/constants/color';
import { createMaterialApi } from 'src/services/material.service';
import { selectFile } from 'src/utils/helper';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { useAppDispatch } from 'src/redux';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { CreateMaterialProps, IMaterialPayload } from 'src/interfaces/material.interface';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';

const CreateMaterial: React.FC<CreateMaterialProps> = ({ route }) => {
  const auth = useSelector(selectAuth);
  const user = auth?.user;

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [newMaterial, setNewMaterial] = useState<IMaterialPayload>({
    title: '',
    description: '',
    file: null,
    materialType: ''
  });

  const handleChange = (name: keyof IMaterialPayload, value: string | object | null | any) => {
    setNewMaterial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectFile = async () => {
    const file = await selectFile();
    console.log('File', file);
    console.log('File Name', file.name);
    if (file) {
      // Extract file extension for

      const fileExtension = file?.name?.split('.').pop()?.toUpperCase() || '';
      console.log(fileExtension);
      handleChange('file', file);
      handleChange('materialType', fileExtension);
    }
  };

  const validate = () => {
    if (!newMaterial.title?.trim()) {
      Alert.alert('Lỗi', 'Tên tài liệu là trường bắt buộc');
      return false;
    }

    if (!newMaterial.description?.trim() && !newMaterial.file) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả hoặc tải tài liệu lên');
      return false;
    }

    const MAX_DESCRIPTION_LENGTH = 500;
    if ((newMaterial.description?.trim().length ?? 0) > MAX_DESCRIPTION_LENGTH) {
      Alert.alert('Lỗi', `Mô tả không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự`);
      return false;
    }

    if (!newMaterial.file) {
      Alert.alert('Lỗi', 'Vui lòng tải tài liệu lên');
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
        token: user?.token,
        classId: route.params.classId,
        title: newMaterial.title,
        description: newMaterial.description,
        file: newMaterial.file,
        materialType: newMaterial.materialType
      };
      dispatch(showLoading());
      const res = await createMaterialApi(payload);
      if (res) {
        switch (res.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Tạo tài liệu thành công');
            navigation.goBack();
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền tạo tài liệu');
            break;
          default:
            Alert.alert('Lỗi', res.data);
            break;
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Hiện không thể tạo tài liệu');
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TextInput
          style={styles.name}
          value={newMaterial.title as string}
          onChangeText={text => handleChange('title', text)}
          placeholder='Material Title *'
          placeholderTextColor={color.submitBtnRed}
        />
        <TextInput
          style={[styles.name, styles.description]}
          value={newMaterial.description as string}
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
              {newMaterial?.file ? newMaterial.file.name : 'Upload File'}
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
    height: 200,
    textAlignVertical: 'top'
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
  }
});

export default CreateMaterial;

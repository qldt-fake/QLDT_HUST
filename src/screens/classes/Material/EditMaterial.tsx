import React, { useState, useEffect } from 'react';
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
import { getMaterialInfoApi, editMaterialApi } from 'src/services/material.service';
import { getTypeOfFile, selectFile } from 'src/utils/helper';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { useAppDispatch } from 'src/redux';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { Linking } from 'react-native';
import { useAlert } from '../../../hooks/useAlert';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { IMaterialPayload } from 'src/interfaces/material.interface';
interface EditMaterialProps {
  route: {
    params: {
      materialId: string;
      classId: string;
    };
  };
}

const EditMaterial: React.FC<EditMaterialProps> = ({ route }) => {
  const { materialId, classId } = route.params;
  const auth = useSelector(selectAuth);
  const user = auth?.user;
  const navigation = useNavigation();
  const { showAlert } = useAlert();
  const dispatch = useAppDispatch();
  const [material, setMaterial] = useState<IMaterialPayload>({
    title: '',
    description: '',
    file: null,
    materialType: '',
    materialLink: '',
    materialId
  });

  useEffect(() => {
    const fetchMaterialDetails = async () => {
      try {
        dispatch(showLoading());
        const res = await getMaterialInfoApi({
          token: user?.token,
          material_id: materialId
        });
        if(res) {
          switch (res.code) {
            case CODE_OK:
              setMaterial({
                title: res.data.material_name || '',
                description: res.data.description || '',
                file: null,
                materialType: res.data.material_type || '',
                materialLink: res.data.material_link || '',
                materialId: materialId
              });
              break;
            case INVALID_TOKEN:
              Alert.alert('Lỗi', 'Token không hợp lệ');
              dispatch(logout());
              break;
            case NOT_ACCESS:
              Alert.alert('Lỗi', 'Bạn không có quyền chỉnh sửa tài liệu');
              break;
            default:
              Alert.alert('Lỗi', res.data);
              break;
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu của tài liệu:', error);
        Alert.alert('Lỗi', 'Không thể lấy dữ liệu của tài liệu');
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchMaterialDetails();
  }, [materialId]);

  const handleChange = (name: string, value: any) => {
    setMaterial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectFile = async () => {
    const file = await selectFile();
    if (file) {
      const fileExtension = file?.name?.split('.').pop()?.toUpperCase() || '';
      handleChange('file', file);
      handleChange('materialType', fileExtension);
    }
  };

  const validate = () => {
    const MAX_DESCRIPTION_LENGTH = 500;
    if ((material.description?.trim().length ?? 0) > MAX_DESCRIPTION_LENGTH) {
      Alert.alert('Lỗi', `Mô tả không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        token: user?.token,
        materialId: materialId,
        classId: classId,
        title: material.title,
        description: material.description,
        file: material.file,
        materialType: material.materialType
      };
      dispatch(showLoading());
      const res = await editMaterialApi(payload);

      if (res) {
        switch (res.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Cập nhật tài liệu thành công');
            navigation.goBack();
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền chỉnh sửa tài liệu');
            break;
          default:
            Alert.alert('Lỗi', res.data);
            break;
        }
      }
    } catch (error) {
      console.error('Error updating material:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật tài liệu');
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleViewMaterial = async () => {
    if (!material.materialLink) return;
    Linking.openURL(material.materialLink);
  };

  return (
    <View style={styles.container}>
      <ClassHeader title='Edit Material' />
      <View style={styles.body}>
        <TextInput
          style={styles.name}
          value={material.title as string}
          onChangeText={text => handleChange('title', text)}
          placeholder='Material Title *'
          placeholderTextColor={color.submitBtnRed}
        />
        <TextInput
          style={[styles.name, styles.description]}
          value={material.description as string}
          onChangeText={text => handleChange('description', text)}
          placeholder='Description'
          multiline
          numberOfLines={6}
          placeholderTextColor={color.submitBtnRed}
        />
        <TouchableOpacity style={styles.viewButton} onPress={handleViewMaterial}>
          <Text style={[styles.text, styles.viewButtonText]}>
            {material.materialLink
              ? material.title + '.' + getTypeOfFile(material.materialType as string)
              : 'No file uploaded'}
          </Text>
        </TouchableOpacity>

        <TouchableHighlight style={styles.fileButton} onPress={handleSelectFile}>
          <>
            <Text
              style={[styles.text, styles.fileButtonText]}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {material.file ? material.file?.name : 'Tải lên file mới'}
            </Text>
            <Icon name='caret-up' size={20} color='#fff' />
          </>
        </TouchableHighlight>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            showAlert('Chỉnh sửa tài liệu', 'Bạn có muốn chỉnh sửa tài liệu này?', handleSubmit);
          }}
        >
          <Text style={[styles.text, styles.submitButtonText]}>Update</Text>
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
  viewButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewButtonText: {
    textAlign: 'center',
    color: color.red
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

export default EditMaterial;

import { StyleSheet, Text, View, Alert, TouchableOpacity, Pressable } from 'react-native';
import BaseImage from 'src/components/BaseImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { Linking } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MaterialNavigationName } from 'src/common/constants/nameScreen';
import { deleteMaterialApi } from 'src/services/material.service';
import { useSelector } from 'react-redux';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { useModal } from '../../../hooks/useBottomModal';
import { useAlert } from '../../../hooks/useAlert';
import { getTypeOfFile } from '../../../utils/helper';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { MaterialCardProps } from 'src/interfaces/material.interface';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { MaterialNavigationType } from 'src/common/type/navigation';

export const MaterialCard: React.FC<MaterialCardProps> = ({
  id,
  material_name,
  description,
  class_id,
  material_link,
  material_type,
  setMaterialList
}: MaterialCardProps) => {
  const navigation: NavigationProp<MaterialNavigationType> = useNavigation();
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const { showModal } = useModal();
  const { showAlert } = useAlert();
  const dispatch = useAppDispatch();

  const handlePress = async () => {
    await Linking.openURL(material_link as string);
  };

  const callDeleteMaterialApi = async () => {
    try {
      dispatch(showLoading());
      const res = await deleteMaterialApi({
        token: user?.token,
        material_id: id
      });

      if (res) {
        switch (res.code) {
          case CODE_OK:
            Alert.alert('Xóa tài liệu', 'Xóa tài liệu thành công');
            setMaterialList?.((prev: any) => prev.filter((item: any) => item.id !== id));
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền xóa tài liệu');
            break;
          default:
            Alert.alert('Lỗi', res.data);
            break;
        }
      }
    } catch (error) {
      console.error('Lỗi khi xóa tài liệu:', error);
      Alert.alert('Lỗi', 'Xóa tài liệu thất bại');
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleEdit = () => {
    navigation.navigate(MaterialNavigationName.EditMaterial, { materialId: id as string, classId: class_id as string });
  };

  const handleDelete = () => {
    showAlert('Xóa tài liệu', 'Bạn có chắc muốn xóa tài liệu này', callDeleteMaterialApi);
  };

  const actions = [
    { icon: 'edit', text: 'Edit Material', onPress: handleEdit },
    { icon: 'trash', text: 'Delete', onPress: handleDelete }
  ];

  const getImageForMaterialType = (materialType: string) => {
    const type = getTypeOfFile(materialType);
  
    switch (type) {
      case 'pdf':
        return require('../../../assets/pdf.png');
      case 'doc':
      case 'docx':
        return require('../../../assets/word.png');
      case 'xls':
      case 'xlsx':
        return require('../../../assets/excel.png');
      case 'ppt':
      case 'pptx':
        return require('../../../assets/ppt.png');
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return require('../../../assets/image.png');
      case 'mp4':
      case 'avi':
      case 'mkv':
      case 'mov':
      case 'wmv':
        return require('../../../assets/video.png');
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
        return require('../../../assets/video.png');
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return require('../../../assets/archive.png');
      case 'txt':
      case 'log':
      case 'md':
        return require('../../../assets/file.png');
      case 'html':
      case 'css':
      case 'js':
      case 'json':
      case 'xml':
        return require('../../../assets/code.png');
      case 'folder': // Nếu là thư mục hoặc không xác định.
        return require('../../../assets/folder.png');
      default:
        return require('../../../assets/folder.png'); // Biểu tượng mặc định nếu không khớp loại.
    }
  };
  

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Pressable style={styles.body} onPress={handlePress}>
          <BaseImage
            style={{ height: 30, width: 30, marginTop: 5 }}
            source={getImageForMaterialType(material_type as string)}
          />
          <View style={styles.content}>
            <Text style={styles.text}>{material_name + '.' + getTypeOfFile(material_type?? '')}</Text>
            <Text style={styles.text}>{description}</Text>
          </View>
        </Pressable>
        <View style={styles.iconBox}>
          <TouchableOpacity onPress={() => showModal(material_name as string, actions)}>
            <Icon name='ellipsis-v' size={20} color='black' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: 90,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    marginVertical: 2,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 10
  },
  body: {
    flex: 8,
    flexDirection: 'row',
    columnGap: 10
  },
  content: {
    flex: 1
  },
  text: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left'
  },
  size: {
    fontSize: 12,
    color: '#666',
    textAlign: 'left'
  },
  actionText: {
    fontSize: 16,
    color: color.primary
  },
  iconBox: {
    flexBasis: 10,
    alignItems: 'flex-end',
    marginBottom: 'auto',
    flex: 2
  }
});

export default MaterialCard;

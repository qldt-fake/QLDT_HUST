import { StyleSheet, Text, View, Alert, TouchableOpacity, Pressable } from 'react-native';
import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { formatDateTime } from 'src/utils/helper';
import { Linking } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNaviagtionName, SurveyNavigationName } from 'src/common/constants/nameScreen';
import { deleteSurveyApi } from 'src/services/survey.service';
import { useSelector } from 'react-redux';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import { useModal } from '../../../hooks/useBottomModal';
import { useAlert } from '../../../hooks/useAlert';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { useAppDispatch } from 'src/redux';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { DATE_TIME_FORMAT } from 'src/common/constants';
import { Roles } from 'src/common/enum/commom';
import { SurveyNavigationType } from 'src/common/type/navigation';


interface ExcerciseCardProps {
  id: string;
  title: string;
  description: string;
  class_id: string;
  deadline: string;
  file_url: string;
  setAssignmentList: any;
  is_submitted?: boolean;
  isInClass ?: boolean;
}

const colors = [color.primary, color.second, color.green, color.yellow, color.textLike];

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const ExcerciseCard = ({
  id,
  title,
  description,
  class_id,
  deadline,
  file_url,
  is_submitted,
  isInClass = false,
  setAssignmentList: setExcerciseList
}: ExcerciseCardProps) => {
  const navigation: NavigationProp<SurveyNavigationType> = useNavigation();
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const { showModal } = useModal();
  const { showAlert } = useAlert();
  const dispatch = useAppDispatch();

  // const handleViewSurvey = useCallback(async () => {
  //   await Linking.openURL(file_url);
  // }, [file_url]);

  const handleViewSurvey = () => {
    if (!file_url) return;

    navigation.navigate(AppNaviagtionName.WebView as any, {
      url: file_url,
      title: title
    } as any);
  };

  const callDeleteSurveyApi = async () => {
    try {
      dispatch(showLoading());
      const res = await deleteSurveyApi({
        token: user?.token,
        survey_id: id
      });
      dispatch(hideLoading());
      if (res) {
        switch (res.meta?.code) {
          case CODE_OK:
            Alert.alert('Xóa bài kiểm tra', 'Xóa bài kiểm tra thành công');
            setExcerciseList((prev: any) => prev.filter((item: any) => item.id !== id));
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Token không hợp lệ');
            dispatch(logout());
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền xóa bài kiểm tra');
            break;
          default:
            Alert.alert('Lỗi', res.meta?.message ?? 'Lỗi không xác định');
            break;
        }
      }
    } catch (error) {
      console.log('Error', error);
      Alert.alert('Lỗi', 'Xóa bài kiểm tra thất bại');
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleNavigate = () => {
    if (user?.role === Roles.STUDENT) {
      if (is_submitted)
        navigation.navigate(SurveyNavigationName.SubmissionDetail as any, { id, title, description, deadline, file_url, class_id, is_submitted });
      else
        navigation.navigate(SurveyNavigationName.SubmitSurvey as any, {
          id: id,
          title: title,
          description: description,
          deadline: deadline,
          file_url: file_url
        });
    } else {
      navigation.navigate(SurveyNavigationName.SubmissionList, { id: id, title: title });
    }
  };

  const handleEdit = () => {
    navigation.navigate(SurveyNavigationName.EditSurvey, {
      id,
      classId: class_id,
      title,
      description,
      deadline,
      file_url
    });
  };

  const handleDelete = () => {
    showAlert('Xóa bài kiểm tra', 'Bạn có chắc muốn xóa bài kiểm tra?', callDeleteSurveyApi);
  };

  const actions = [
    { icon: 'edit', text: 'Chỉnh sửa bài kiểm tra', onPress: handleEdit },
    { icon: 'trash', text: 'Xóa', onPress: handleDelete }
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.body} onPress={handleNavigate}>
          <View style={[styles.colorBlock, { backgroundColor: getRandomColor() }]}>
            <Text style={styles.initials}>{title.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.text}>{title + (!isInClass ? ' - '+ class_id : '') }</Text>
            <Text style={[styles.text, { color: color.red }]}>
              {'Hạn: ' + formatDateTime(DATE_TIME_FORMAT.dddd_vi_DD_MM_YYYY_DASH, new Date(deadline))}
            </Text>
            {file_url && (
              <Pressable
                onPressIn={event => {
                  event.stopPropagation();
                  handleViewSurvey();
                }}
              >
                <Text style={styles.actionText}>Xem tài liệu</Text>
              </Pressable>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.iconBox}>
          {user?.role === Roles.LECTURER ? (
            <TouchableOpacity onPress={() => showModal(`Excercise ${title}`, actions)}>
              <Icon name='ellipsis-v' size={20} color='black' />
            </TouchableOpacity>
          ) : (
            is_submitted && (
              <TouchableOpacity onPress={() => showModal(`Excercise ${title}`, actions)}>
                <Icon name='check' size={20} color={color.green} />
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 1,
    height: 100
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 10
  },
  body: {
    flex: 8,
    flexDirection: 'row',
    columnGap: 10
  },
  colorBlock: {
    height: 30,
    width: 30,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  initials: {
    color: '#fff',
    fontWeight: 'bold'
  },
  content: {
    flex: 1
  },
  text: {
    fontSize: 14,
    color: '#000',
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
    flex: 1
  }
});

export default ExcerciseCard;
import { StyleSheet, Text, View, Alert, TouchableOpacity, Pressable } from 'react-native';
import React, { useCallback } from 'react';
import BaseImage from 'src/components/BaseImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { formatDate } from 'src/utils/helper';
import { Linking } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SurveyNavigationName } from 'src/common/constants/nameScreen';
import { deleteSurveyApi } from 'src/services/survey.service';
import { useSelector } from 'react-redux';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { selectAuth } from 'src/redux/slices/authSlice';
import { useModal } from '../../../hooks/useBottomModal';
import { useAlert } from '../../../hooks/useAlert';

interface ExcerciseCardProps {
  id : string;
  title : string;
  description : string;
  class_id : string;
  deadline : string;
  file_url : string;
  setAssignmentList : any;
}

export const ExcerciseCard = ({
  id,
  title,
  description,
  class_id,
  deadline,
  file_url,
  setAssignmentList: setExcerciseList
}: ExcerciseCardProps) => {

  const navigation: NavigationProp<SurveyType> = useNavigation();
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const { showModal } = useModal();
  const { showAlert } = useAlert();

  const handleViewSurvey = useCallback(async () => {
    await Linking.openURL(file_url);
  }, [file_url]);
 
  const callDeleteSurveyApi = async () => {
    const res = await deleteSurveyApi({
      token: user?.token,
      survey_id: id
    });
    console.log('Delete Survey APi', res);
    if (res && res.data && res.meta.code === ReponseCode.CODE_OK) {
      Alert.alert('Delete Excercise', 'Delete excercise successfully');
      setExcerciseList((prev: any) => prev.filter((item: any) => item.id !== id));
    }
  };

  const handleEdit = () => {
    navigation.navigate(SurveyNavigationName.EditSurvey, { surveyId: id, classId: class_id });
  };

  const handleDelete = () => {
    showAlert('Delete Excercise', 'Are you sure to delete this excercise?', callDeleteSurveyApi);
  };

  const actions = [
    { icon: 'edit', text: 'Edit Survey', onPress: handleEdit },
    { icon: 'trash', text: 'Delete', onPress: handleDelete }
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.body}
          onPress={() =>
            navigation.navigate(SurveyNavigationName.SubmitSurvey as never, {
              id: id,
              title: title,
              description: description,
              deadline: deadline,
              file_url: file_url
            } as never)
          }
        >
          <BaseImage
            style={{ height: 30, width: 30, marginTop: 5 }}
            source={require('../../../assets/avatar-default.jpg')}
          />
          <View style={styles.content}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.text}>{formatDate(deadline)}</Text>
            <Text style={styles.text}>{description}</Text>
            <Pressable
              onPressIn={event => {
                event.stopPropagation(); 
                handleViewSurvey();
              }}
            >
              <Text style={styles.actionText}>Xem tài liệu</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
        <View style={styles.iconBox}>
          <TouchableOpacity onPress={() => showModal(`Excercise ${title}`, actions)}>
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
    zIndex: 1
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

import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import BaseImage from 'src/components/BaseImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { formatDate } from 'src/utils/helper';
import BaseModal from 'src/components/BaseModal';
import { Linking } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native'; // Import your delete API function
import { SurveyNavigationName } from 'src/common/constants/nameScreen';
import { assign } from 'lodash';
import { deleteSurveyApi } from 'src/services/survey.service';
import { useSelector } from 'react-redux';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { selectAuth } from 'src/redux/slices/authSlice';
export const ExcerciseCard = ({ props }: { props: any }) => {
  console.log("Props: ", props);
  const { id, title, description, class_id, deadline, file_url, setAssignmentList: setExcerciseList } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation: NavigationProp<SurveyType> = useNavigation();
  const auth = useSelector(selectAuth)
  const user = auth.user
  const handlePress = useCallback(async () => {
    const supported = await Linking.openURL(file_url);

    if (supported) {
      await Linking.openURL(file_url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${file_url}`);
    }
  }, [file_url]);

  const callDeleteSurveyApi = async () => {
    const res = await deleteSurveyApi({
      token: user?.token!,
      survey_id: id,
    });
    console.log("Delete Survey APi", res)
    if (res && res.data && res.meta.code === ReponseCode.CODE_OK) {
      Alert.alert('Delete Excercise', 'Delete excercise successfully');
      setExcerciseList((prev: any) => prev.filter((item: any) => item.id !== props.id));
    }
  };

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate(SurveyNavigationName.EditSurvey, { surveyId: id, classId: class_id }); // Assuming you have an EditExcercise screen
  };

  const handleDelete = () => {
    setModalVisible(false);
    Alert.alert(
      'Delete Excercise',
      'Are you sure you want to delete this excercise?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => callDeleteSurveyApi(),
        },
      ]
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.body} onPress={handlePress}>
          <BaseImage
            style={{ height: 30, width: 30, marginTop: 5 }}
            source={require('../../../assets/avatar-default.jpg')}
          />
          <View style={styles.content}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.text}>{formatDate(deadline)}</Text>
            <Text style={styles.text}>{description}</Text>
            <TouchableOpacity onPress={handlePress}>
              <Text style={{ color: color.primary }}>Link Tài liệu</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles.iconBox}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name='ellipsis-v' size={20} color='black' />
          </TouchableOpacity>
        </View>
      </View>
      <BaseModal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            <Text style={styles.modalTitle}>{'Excercise ' + title}</Text>
          </View>
          <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
            <Icon name='edit' size={20} color={color.primary} />
            <Text style={styles.actionText}>Edit Survey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
            <Icon name='trash' size={20} color={color.primary} />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 40,
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 10,
  },
  body: {
    flex: 8,
    flexDirection: 'row',
    columnGap: 10,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
  },
  actionText: {
    fontSize: 16,
    color: color.primary,
  },
  iconBox: {
    flexBasis: 10,
    alignItems: 'flex-end',
    marginBottom: 'auto',
    flex: 2,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    columnGap: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default ExcerciseCard;
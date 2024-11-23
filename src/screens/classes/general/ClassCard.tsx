import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Roles } from 'src/common/enum/commom';
import { ClassNavigationName } from 'src/common/constants/nameScreen';
import { deleteClassApi } from 'src/services/class.service';
import { selectAuth } from 'src/redux/slices/authSlice';
import { CODE_OK } from 'src/common/constants/responseCode';
import { useModal } from '../../../hooks/useBottomModal';
import { useAlert } from '../../../hooks/useAlert';
import { formatDateTime } from 'src/utils/helper';
import { DATE_TIME_FORMAT } from 'src/common/constants';
const ClassCard = (args: { props: any }) => {
  const { props } = args;
  const { class_name, class_id, class_type, start_date, end_date, setClassList } = props;
  console.log('ClassId: ', class_id);
  const navigation: NavigationProp<ClassNavigationType> = useNavigation();
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const { showModal } = useModal();
  const {showAlert} = useAlert();

  const handlePress = () => {
    navigation.navigate(ClassNavigationName.ClassDetail, { classId: class_id });
  };

  const callDeleteClassApi = async () => {
    const res = await deleteClassApi({
      token: user?.token,
      role: user?.role,
      account_id: user?.id,
      class_id: class_id
    });
    console.log(res);
    if (res && res.meta.code === CODE_OK) {
      Alert.alert('Delete Class', 'Delete class successfully');
      setClassList((prev: any) => prev.filter((item: any) => item.class_id !== class_id));
    }
  };

  const handleEdit = () => {
    navigation.navigate(ClassNavigationName.EditClass, { classId: class_id });
  };

  const handleDelete = () => {
    showAlert('Delete Class', 'Are you sure to delete this class?', callDeleteClassApi);
  };

  const actions = [
    { icon: 'edit', text: 'Edit Class', onPress: handleEdit },
    { icon: 'trash', text: 'Delete', onPress: handleDelete }
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.body} onPress={handlePress}>
          <Text style={styles.text}>{class_id + '-' + class_name}</Text>
          <View style={styles.classTimeBox}>
            <View style={styles.schedule}>
              <Icon name='circle' size={7} color='#66e0ff' />
              <Text style={[styles.text, { fontSize: 12 }]}>
                {'Từ ' + formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH,start_date) + ' Đến ' + formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH,end_date)}
              </Text>
            </View>
            <View style={styles.schedule}>
              <Icon name='circle' size={7} color='#ffff66' />
              <Text style={[styles.text, { fontSize: 12, color: color.textGray }]}>
                {class_type}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={[styles.iconBox, user?.role === Roles.LECTURER ? { marginBottom: 'auto' } : {}]}
        >
          {user?.role === Roles.STUDENT ? (
            <Icon name='chevron-right' size={14} color={color.black} />
          ) : (
            <TouchableOpacity onPress={() => showModal(class_name, actions)} style={{ padding: 10 }}>
              <Icon name='ellipsis-v' size={20} color={color.black} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginVertical: 1,
    backgroundColor: color.cardClassBg,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 5,
  },
  body: {
    flex: 8,
    rowGap: 10
  },
  text: {
    fontSize: 16,
    color: '#000'
  },
  iconBox: {
    flex: 1,
    alignItems: 'flex-end'
  },
  classTimeBox: {},
  schedule: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5
  }
});

export default ClassCard;
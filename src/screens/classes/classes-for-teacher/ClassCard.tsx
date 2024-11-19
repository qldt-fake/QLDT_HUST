import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux';
import { Roles } from 'src/common/enum/commom';
import { ClassNavigationName } from 'src/common/constants/nameScreen';
import BaseModal from 'src/components/BaseModal';
import { deleteClassApi } from 'src/services/class.service';

const ClassCard = ({ props }) => {
  const { class_name, class_id, class_type, start_date, end_date, setClassList } = props;
  console.log("ClassId: ", class_id);
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { role, token, id  } = user;
  const [modalVisible, setModalVisible] = useState(false);

  const callDeleteClassApi = async () => {
    const res = await deleteClassApi({
      token: token,
      role: role,
      account_id: id,
      class_id: class_id
    });
    console.log(res);
    if (res && res.data && res.meta.code === ReponseCode.CODE_OK) {
      Alert.alert('Delete Class', 'Delete class successfully');
      setClassList((prev) => prev.filter((item) => item.class_id !== class_id));
    }
  }
  

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate(ClassNavigationName.EditClass, { classId: class_id });
  }

  const handleDelete = () => {
    setModalVisible(false);
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => callDeleteClassApi(),
        }
      ]
    );
  }

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.container}
       
      >
        <TouchableOpacity style={styles.body}  onPress={() => navigation.navigate(ClassNavigationName.ClassDetail, { classId: class_id })}>
          <Text style={styles.text}>{class_id + '-' + class_name}</Text>
          <View style={styles.classTimeBox}>
            <View style={styles.schedule}>
              <Icon name='circle' size={7} color='#66e0ff' />
              <Text style={[styles.text, { fontSize: 12 }]}>
                {'Từ ' + start_date + ' Đến ' + end_date}
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
        <View style={[styles.iconBox, role === Roles.LECTURER ? { marginBottom: 'auto' } : {}]}>
          {role === Roles.STUDENT ? (
            <Icon name='chevron-right' size={14} color={color.black} />
          ) : (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Icon name='ellipsis-v' size={18} color={color.black} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <BaseModal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            <Text style={styles.modalTitle}>{'Class ' + class_name}</Text>
          </View>
          <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
            <Icon name='edit' size={20} color={color.primary} />
            <Text style={styles.text}>Edit Class</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
            <Icon name='trash' size={20} color={color.primary} />
            <Text style={styles.text}>Delete</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>
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
    backgroundColor: color.cardClassBg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
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
    flex: 2,
    alignItems: 'flex-end'
  },
  classTimeBox: {},
  schedule: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1 // Ensure this is lower than the ClassCard component
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalOption: {
    flexDirection: 'row',
    columnGap: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center'
  }
});

export default ClassCard;

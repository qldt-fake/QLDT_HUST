import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Pressable } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ClassHeader from './ClassHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import Assignment from './Assignment';
import ClassDetailSummary from './ClassDetailSummary';
import { getClassApi } from 'src/services/class.service';
import { ReponseCode } from 'src/common/enum/reponseCode';

const classDeatailContext = createContext(null);
const Tab = createMaterialTopTabNavigator();

const data = [
  { id: '1', title: 'BIEN CHUNG VA SIEU HINH.docx', size: '25 KB', author: 'Hoang Anh Chung' },
  { id: '2', title: 'TUAN 15 - C3 - VAI TRO QDND...', size: '116.2 MB', author: 'Hoang Thi Hanh' },
  // Thêm các mục khác tương tự
];

const FileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const openModal = (file) => {
    setSelectedFile(file);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFile(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Image style={styles.iconImg} source={require("../../../assets/folder.png")} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.size}>{item.size}, Được sửa đổi bởi {item.author}</Text>
      </View>
      <TouchableOpacity onPress={() => openModal(item)}>
        <Icon name='ellipsis-h' size={20} color='#888' />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalContainer} onPressOut={closeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedFile?.title}</Text>
            <TouchableOpacity style={styles.modalOption}>
              <Text>Mở</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption}>
              <Text>Làm có sẵn ngoại tuyến</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption}>
              <Text>Đổi tên</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption}>
              <Text>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption}>
              <Text>Chia sẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption}>
              <Text>Sao chép liên kết</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption}>
              <Text>Gửi một bản</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption}>
              <Text>Mở trong ứng dụng</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const PostScreen = () => {
  const classId = useContext(classDeatailContext);
  
  const [classDetail, setClassDetail] = useState(null);

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        const res = await getClassApi({
          token: '93fxxl',
          role : 'STUDENT',
          account_id: '245',
          class_id: '222',
        });
        if(res && res.data && res.meta.code === ReponseCode.CODE_OK) {
          setClassDetail(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClassDetail();
  }, [classId]);

  return (
    <View style={styles.center}>
      <Text>Chào mừng đến với lớp học D14TH05</Text>
      {classDetail && <ClassDetailSummary {...classDetail} />}
    </View>
  );
};

const SurveyScreen = () => (
  <View style={styles.center}>
    <Text>Danh sách bài kiểm tra</Text>
  </View>
);

const ClassDetail = ({classId}) => {
  return (
    <classDeatailContext.Provider value={classId}>
      <ClassHeader title="D14TH05 - Lớp học 1" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIndicatorStyle: { backgroundColor: '#6200EE' },
          }}
        >
          <Tab.Screen name="Bài đăng" component={PostScreen} />
          <Tab.Screen name="Tệp" component={FileScreen} />
          <Tab.Screen name="Bài tập">
            {() => <Assignment classId={222} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </classDeatailContext.Provider>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 20,
  },
  iconImg: {
    width: 35,
    height: 35,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  size: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
  },
});

export default ClassDetail;

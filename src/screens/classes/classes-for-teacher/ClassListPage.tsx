import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import ClassCard from './ClassCard';
import { getClassListApi } from 'src/services/class.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { ClassNavigationName, SurveyNavigationName } from 'src/common/constants/nameScreen';
import { useNavigation } from '@react-navigation/native';
import { Roles } from 'src/common/enum/commom';
import { RootState } from 'src/redux';
import { ActivityIndicator } from 'react-native';

const ClassListPage = () => {
  const [classList, setClassList] = React.useState<any[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const { token, role, id } = user || {};
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      console.log(token,role,id);
      
      const res = await getClassListApi({
        token: token,
        role: role,
        account_id: id
      });
      console.log(res);
      if (res && res.data && res.meta.code === ReponseCode.CODE_OK) {
        setClassList(res.data.page_content);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      {/* <ClassHeader textLogo='Thông tin lớp' /> */}
      <Text style={styles.title}>Danh sách lớp trong học kỳ :</Text>
      <View style={styles.body}>
        <>
          {classList.length > 0 ? (
            <FlatList
              contentContainerStyle={{ gap: 10 }}
              data={classList}
              renderItem={data => <ClassCard props={{ ...(data.item), setClassList }} />}
            />
          ) : (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#D3310B" />
            </View>)}
        </>
      </View>
      {role === Roles.LECTURER &&
        <Pressable
          style={styles.floatingButton}
          onPress={() => navigation.navigate(ClassNavigationName.CreateClass as never)}
        >
          <Icon name='plus' size={20} color={color.white} />
        </Pressable>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
   marginTop: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
    zIndex: 0
  },
  title: {
    margin: 10,
    fontSize: 18
  },
  body: {
    padding: 10
  },
  classList: {
    gap: 10
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: color.red,
    borderRadius: 30,
    // padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50
  }
});
export default ClassListPage;

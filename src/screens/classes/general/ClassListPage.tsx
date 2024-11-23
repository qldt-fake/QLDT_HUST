import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import React, { useCallback } from 'react';
import ClassCard from './ClassCard';
import { getClassListApi } from 'src/services/class.service';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { ClassNavigationName } from 'src/common/constants/nameScreen';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Roles } from 'src/common/enum/commom';
import { RootState } from 'src/redux';
import { CODE_OK } from 'src/common/constants/responseCode';

const ClassListPage = () => {
  const [classList, setClassList] = React.useState<any[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const { token, role, id } = user || {};
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await getClassListApi({
            token: token,
            role: role,
            account_id: id
          });
          if (res && res.data && res.meta.code === CODE_OK) {
            console.log(res.data.page_content);
            setClassList(res.data.page_content);
          }
        } catch (error) {
          console.error('Error fetching class list:', error);
        }
      };

      fetchData();
    }, [token, role, id])
  );

  const renderItem = ({ item }: { item: any }) => <ClassCard props={{ ...item, setClassList }} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Danh sách lớp trong học kỳ :</Text>
      <View style={styles.body}>
        {classList.length > 0 ? (
          <FlatList
            data={classList}
            renderItem={renderItem}
            contentContainerStyle={styles.classList}
          />
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size='large' color='#D3310B' />
          </View>
        )}
      </View>
      {role === Roles.LECTURER && (
        <Pressable
          style={styles.floatingButton}
          onPress={() => navigation.navigate(ClassNavigationName.CreateClass as never)}
        >
          <Icon name='plus' size={20} color={color.white} />
        </Pressable>
      )}
    </SafeAreaView>
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
    padding: 10,
    height: 600
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
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50
  }
});

export default ClassListPage;

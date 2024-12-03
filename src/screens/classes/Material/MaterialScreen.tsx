// MaterialScreen.tsx
import { FlatList, StyleSheet, TouchableOpacity, Text, Alert, SafeAreaView } from 'react-native';
import React, { useCallback } from 'react';
import { getMaterialListApi } from 'src/services/material.service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { color } from 'src/common/constants/color';
import { Roles } from 'src/common/enum/commom';
import { MaterialNavigationName } from 'src/common/constants/nameScreen';
import { logout, selectAuth } from 'src/redux/slices/authSlice';
import MaterialCard from './MaterialCard';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { useAppDispatch } from 'src/redux';
import EmptyState from 'src/components/EmptyState';
import { MaterialNavigationType } from 'src/common/type/navigation';

const MaterialScreen = (args: { classId: string }) => {
  const { classId } = args;
  const [materialList, setMaterialList] = React.useState<any[]>([]);
  const navigation: NavigationProp<MaterialNavigationType> = useNavigation();
  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchMaterials = async () => {
        try {
          dispatch(showLoading());
          const res = await getMaterialListApi({
            token: auth?.user?.token as string,
            class_id: classId
          });
          if(res) {
            switch (res.code) {
              case CODE_OK:
                setMaterialList(res.data);
                break;
              case INVALID_TOKEN:
                Alert.alert('Lỗi', 'Token không hợp lệ');
                dispatch(logout());
                break;
              case NOT_ACCESS:
                Alert.alert('Lỗi', 'Bạn không có quyền xem tài liệu');
                break;
              default:
                Alert.alert('Lỗi', res.message ?? 'Lỗi không xác định');
                break;
            }
          }
        } catch (error) {
          console.error('Lỗi khi lấy tài liệu:', error);
        } finally {
          dispatch(hideLoading());
        }
      };
      fetchMaterials();
    }, [classId, auth?.user?.token])
  );

 return (
    <SafeAreaView style={styles.container}>
      {materialList.length === 0 ? (
        <EmptyState title="Không có tài liệu nào" />
      ) : (
        <FlatList
          data={materialList}
          renderItem={data => <MaterialCard {...data.item} setMaterialList={setMaterialList} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingBottom: 100,
  },
});


export default MaterialScreen;
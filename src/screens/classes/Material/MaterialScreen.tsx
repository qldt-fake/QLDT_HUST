// MaterialScreen.tsx
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback } from 'react';
import { getMaterialListApi } from 'src/services/material.service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { color } from 'src/common/constants/color';
import { Roles } from 'src/common/enum/commom';
import { MaterialNavigationName } from 'src/common/constants/nameScreen';
import { selectAuth } from 'src/redux/slices/authSlice';
import MaterialCard from './MaterialCard';
import { CODE_OK } from 'src/common/constants/responseCode';

const MaterialScreen = (args: { classId: string }) => {
  const { classId } = args;
  const [materialList, setMaterialList] = React.useState<any[]>([]);
  const navigation: NavigationProp<MaterialNavigationType> = useNavigation();
  const auth = useSelector(selectAuth);

  useFocusEffect(
    useCallback(() => {
      const fetchMaterials = async () => {
        const res = await getMaterialListApi({
          token: auth?.user?.token as string,
          class_id: classId
        });
        if (res && res.data && res.code === CODE_OK) {
          setMaterialList(res.data);
        }
      };
      fetchMaterials();
    }, [classId, auth?.user?.token])
  );

  return (
    <>
      <FlatList
        data={materialList}
        renderItem={data => <MaterialCard {...data.item} setMaterialList={setMaterialList} />}
        keyExtractor={item => item.id.toString()}
        style={{ padding: 10 }}
      />
      {auth?.user?.role === Roles.LECTURER && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate(MaterialNavigationName.UploadMaterial, { classId })}
        >
          <Icon name='plus' size={20} color={color.white} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: color.red,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    zIndex: 10
  }
});

export default MaterialScreen;
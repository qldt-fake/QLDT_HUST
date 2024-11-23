import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useCallback } from 'react';
import BaseButton from 'src/components/BaseButton';
import ExcerciseCard from './ExcerciseCard';
import { getSurveyListApi } from 'src/services/survey.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { color } from 'src/common/constants/color';
import { Roles } from 'src/common/enum/commom';
import { SurveyNavigationName } from 'src/common/constants/nameScreen';
import { selectAuth } from 'src/redux/slices/authSlice';

const Assignment = (args: { classId: string }) => {
  const { classId } = args;
  const [assignmentList, setAssignmentList] = React.useState<any[]>([]);
  const navigation: NavigationProp<SurveyType> = useNavigation();

  const auth = useSelector(selectAuth);

  useFocusEffect(
    useCallback(() => {
      const fetchAllSurveys = async () => {
        const res = await getSurveyListApi({
          token: auth?.user?.token,
          class_id: classId
        });
        console.log(res);
        if (res && res.data && res.meta.code === ReponseCode.CODE_OK) {
          setAssignmentList(res.data);
        }
      };
      fetchAllSurveys();
    }, [classId, auth?.user?.token])
  );

  return (
    <>
      <View style={styles.boxFilters}>
        <BaseButton
          borderRadius={12}
          buttonColor='#D3310B'
          textColor='white'
          mode='contained'
          onPress={() => console.log('Button pressed')}
        >
          Sắp tới
        </BaseButton>
        <BaseButton
          borderRadius={12}
          buttonColor='#D3310B'
          textColor='white'
          mode='contained'
          onPress={() => console.log('Button pressed')}
        >
          Quá hạn
        </BaseButton>
        <BaseButton
          borderRadius={12}
          buttonColor='#D3310B'
          textColor='white'
          mode='contained'
          onPress={() => console.log('Button pressed')}
        >
          Đã hoàn thành
        </BaseButton>
      </View>
      <FlatList
        data={assignmentList}
        renderItem={data => <ExcerciseCard {...data.item!} setAssignmentList={setAssignmentList} />}
        keyExtractor={item => item?.id}
      />
      {auth?.user?.role === Roles.LECTURER && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate(SurveyNavigationName.CreateSurvey, { classId })}
        >
          <Icon name='plus' size={20} color={color.white} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  boxFilters: {
    flexDirection: 'row',
    gap: 10,
    height: 50,
    paddingHorizontal: 10,
    marginTop: 20
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
export default Assignment;

import { FlatList, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { Component, useEffect } from 'react';
import ClassHeader from './ClassHeader';
import BaseButton from 'src/components/BaseButton';
import ExcerciseCard from './ExcerciseCard';
import { getSurveyListApi } from 'src/services/survey.service';
import { ReponseCode } from 'src/common/enum/reponseCode';

const Assignment = ({classId}) => {
  
  const [assignmentList, setAssignmentList] = React.useState([]);

  useEffect(() => {
    const fetchAllSurveys = async () => {
      const res = await getSurveyListApi({
        token: '93fxxl',
        class_id: classId,
      });
      console.log(res);
      if (res && res.data && res.meta.code === ReponseCode.CODE_OK) {
        setAssignmentList(res.data);
      }
    }
    fetchAllSurveys();
  }
  , [classId]);

  return (

      <>
      <View style= {styles.boxFilters}>
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
        renderItem={(data) => <ExcerciseCard props = {data.item} />}
        keyExtractor={(item) => item.toString()}
      />
      </>

  );
};

const styles = StyleSheet.create({
  boxFilters: {
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 10,
    height: 50,
    paddingHorizontal: 10,
    marginTop: 20,
  },
});
export default Assignment;

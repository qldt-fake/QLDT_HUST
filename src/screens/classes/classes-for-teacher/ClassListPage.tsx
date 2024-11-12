import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import ClassHeader from './ClassHeader';
import ClassCard from './ClassCard';
import { getClassListApi } from 'src/services/class.service';
import { ReponseCode } from 'src/common/enum/reponseCode';
const ClassListPage = () => {
  const [classList, setClassList] = React.useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getClassListApi({
        token: '93fxxl',
        role: 'LECTURER',
        account_id: '245'
      })
      console.log(res);
      if(res && res.data && res.meta.code === ReponseCode.CODE_OK) {
      setClassList(res.data);
    }
    fetchData();
  }
  , []);
  return (
    <View style={styles.container}>
      <ClassHeader textLogo='Thông tin lớp'/>
      <Text style={styles.title}>Danh sách lớp trong học kỳ :</Text>
      <View style={styles.body}>
        <FlatList contentContainerStyle = {{gap: 10}} data={classList} renderItem={(data) => <ClassCard props = {data.item}/>} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title : {
    margin: 10,
    fontSize:18,
  },
  body: {
    padding: 10,
  },
  classList: {
    gap: 10,
  }
});
export default ClassListPage;

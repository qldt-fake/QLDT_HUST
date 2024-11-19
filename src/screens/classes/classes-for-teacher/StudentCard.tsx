import { StyleSheet, Text, View, Button, Linking, Alert, TouchableOpacity } from 'react-native';
import {React, useCallback} from 'react';
import BaseImage from 'src/components/BaseImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { formatDate } from 'src/utils/helper';

export const StudentCard = ({props}) => {
    console.log(props);
    const {account_id, last_name, first_name, email, student_id} = props;
    return (
      <View style={styles.container}>
        <BaseImage
          style={{ height: 40, width: 40, marginTop: 5, borderRadius: 20, borderWidth: 0.5, borderColor: color.red}}
          source={require('../../../assets/avatar-default.jpg')}
        />
        <View style={styles.content}>
          <Text style={styles.text}>{first_name+ ' '+ last_name}</Text>
          <Text style={styles.text}>{student_id}</Text>
        </View>
        <Text style = {styles.icon}>
          <Icon name='ellipsis-v' size={20} color='black' />
        </Text>
       
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    height: 70,
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    columnGap: 10,
    borderBottomWidth: 0.5,
    borderColor: color.black,
    borderRadius: 10,
  }, 
  content : {
    flex: 1,
    justifyContent: 'center',
  },
  text : {
    textAlign: 'left',
    fontSize: 16,
  },
  icon: {
    marginLeft: 'auto',
  }
});
export default StudentCard;

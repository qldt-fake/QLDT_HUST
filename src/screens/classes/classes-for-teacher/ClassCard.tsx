import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
const ClassCard = ({props}) => {
  console.log(props);
  const {class_name, class_id, class_type, start_date, end_date} = props;
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.body}>
        <Text style = {styles.text}>{class_id + "-" + class_name}</Text>
        <View style={styles.classTimeBox}>
          <View style= {styles.schedule}>
            <Icon name='circle' size={7} color='#66e0ff' />
            <Text style = {[styles.text,{fontSize: 12}]}>{"Từ " + start_date + " Đến "+ end_date }</Text>
          </View>
          <View style = {styles.schedule}>
            <Icon name='circle' size={7} color='#ffff66' />
            <Text style = {[styles.text,{fontSize: 12, color: color.textGray}]}>{class_type}</Text>
          </View>
        </View>
      </View>
      <View style={styles.iconBox}>
        <Icon name='chevron-right' size={14} color ={color.black} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.cardClassBg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  body: {
    flex: 1,
    rowGap: 10
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
  iconBox: {},
  classTimeBox: {},
  schedule : {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  }
});
export default ClassCard;

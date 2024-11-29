import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from "src/common/constants/color";
import { selectAuth } from "src/redux/slices/authSlice";
import { useSelector } from "react-redux";
import { Roles } from "src/common/enum/commom";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AbsenceNavigationName, SurveyNavigationName } from "src/common/constants/nameScreen";

const OthersTabInClass = (args : {classId : string}) => {
    const {classId} = args;
    const auth = useSelector(selectAuth);
    const navigation : NavigationProp<any>= useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.item} onPress = {()=> navigation.navigate(SurveyNavigationName.SurveyList as any, {classId})}>
        <Icon name="book" size={30} color={color.primary} />
        <Text style={styles.text}>Bài tập</Text>
      </TouchableOpacity>
      {auth?.user?.role === Roles.STUDENT && (
        <TouchableOpacity style={styles.item} onPress = {() => navigation.navigate(AbsenceNavigationName.RequestAbsence as any, {classId})}>
        <Icon name="user-times" size={30} color={color.primary} />
        <Text style={styles.text}>Xin nghỉ</Text>
      </TouchableOpacity>
      )}
      

      {auth?.user?.role === Roles.LECTURER && (
         <TouchableOpacity style={styles.item}>
         <Icon name="calendar-check-o" size={30} color={color.primary} />
         <Text style={styles.text}>Điểm danh</Text>
       </TouchableOpacity>
      )}
        {auth?.user?.role === Roles.LECTURER && (
         <TouchableOpacity style={styles.item} onPress = {()=> navigation.navigate(AbsenceNavigationName.AbsenceList, {classId})}>
         <Icon name="mail-forward" size={30} color={color.primary} />
         <Text style={styles.text}>Yêu cầu vắng mặt</Text>
       </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.item}>
        <Icon name="list" size={30} color={color.primary} />
        <Text style={styles.text}>Khác</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.backGroundgGray,
  },
  text: {
    marginLeft: 16,
    fontSize: 18,
  },
});

export default OthersTabInClass;
import { StyleSheet, Text, View, Button, Linking, Alert, TouchableOpacity } from 'react-native';
import BaseImage from 'src/components/BaseImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { formatDate } from 'src/utils/helper';
import { selectAuth } from 'src/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { Roles } from 'src/common/enum/commom';
import { addStudentToClass } from 'src/services/class.service';
import { useAppDispatch } from 'src/redux';
import { showLoading, hideLoading } from 'src/redux/slices/loadingSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
export const StudentCard = ({ props, onAddStudent }: { props: any; onAddStudent?: any }) => {
  const navigation: NavigationProp<ClassNavigationType> = useNavigation();
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const { account_id, last_name, first_name, email, student_id, isSearch, class_id, token } = props;
  const dispatch = useAppDispatch()
  const handleAddStudentToClass = async () => {
    try {
      dispatch(showLoading())
      const result = await addStudentToClass({
        account_id: account_id,
        token: token,
        class_id: class_id,
      });
      dispatch(hideLoading())
      onAddStudent && onAddStudent(result);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.infoBox}
        onPress={() => {
          navigation.navigate('GetStudentInfor', { account_id })
        }}
      >
        <BaseImage
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 0.5,
            borderColor: color.red,
          }}
          source={require('../../../assets/avatar-default.jpg')}
        />
        <View style={styles.content}>
          <Text style={styles.text} numberOfLines={1}>
            {first_name + ' ' + last_name}
          </Text>
          <Text style={styles.text}>
            ID: <Text>{account_id}</Text>
          </Text>
        </View>
      </TouchableOpacity>


      <View style={[styles.iconBox, user?.role === Roles.LECTURER ? { marginBottom: 'auto' } : {}]}>
        {user?.role === Roles.STUDENT ? (
          <Icon name="chevron-right" size={14} color={color.black} />
        ) : isSearch === true ? (
          <TouchableOpacity style={{ padding: 10 }} onPress={handleAddStudentToClass}>
            <Icon name="plus" size={25} color={color.black} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ padding: 10 }}>
            <Icon name="ellipsis-v" size={25} color={color.black} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    columnGap: 10,
    borderBottomWidth: 0.5,
    borderColor: color.black,
    borderRadius: 10
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10
  },
  text: {
    textAlign: 'left',
    fontSize: 16,
    minWidth: 150
  },
  icon: {
    marginLeft: 'auto'
  },
  iconBox: {
    flex: 2,
    alignItems: 'flex-end'
  },
  infoBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default StudentCard;

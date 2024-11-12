import { StyleSheet, Text, View, Button, Linking, Alert, TouchableOpacity } from 'react-native';
import {React, useCallback} from 'react';
import BaseImage from 'src/components/BaseImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { formatDate } from 'src/utils/helper';

export const ExcerciseCard = ({props}) => {
    const {title, description, class_id, deadline, file_url} = props;
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.openURL(file_url);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(file_url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${file_url}`);
      }
    }, [file_url]);
    return (
      <View style={styles.container}>
        <BaseImage
          style={{ height: 30, width: 30, marginTop: 5}}
          source={require('../../../assets/avatar-default.jpg')}
        />
        <View style={styles.content}>
          <Text style={styles.text}>{title}</Text>
          <Text style={styles.text}>{formatDate(deadline)}</Text>
          <Text style={styles.text}>{description}</Text>
          <TouchableOpacity onPress={handlePress}><Text style = {{color:color.primary}}>Link Tài liệu</Text></TouchableOpacity>
        </View>
        <Text style = {styles.icon}>
          <Icon name='ellipsis-v' size={20} color='black' />
        </Text>
       
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    height: 130,
    marginHorizontal: 40,
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    columnGap: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 10,
  }, 
  content : {
    flex: 1,
  },
  text : {
    textAlign: 'left',
  },
  icon: {
    marginLeft: 'auto',
  }
});
export default ExcerciseCard;

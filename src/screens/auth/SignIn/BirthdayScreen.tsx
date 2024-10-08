import { useState, useEffect } from 'react';
import { Text } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import BaseButton from 'src/components/BaseButton';
import WrapperAuthScreen from 'src/components/WraperScreen';
import { color } from 'src/common/constants/color';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';

function DatePickerScreen() {
  const [date, setDate] = useState(new Date('2000-1-1'));
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const naviagtion: NavigationProp<AuthNavigationType, 'GenderScreen'> = useNavigation();
  const route: RouteProp<AuthNavigationType, 'BirthdayScreen'> = useRoute();
  const handleSubmit = () => {
    naviagtion.navigate('GenderScreen', {
      ...route.params
      // dob: new Date(Date.now())
    });
  };
  const getAge = (DOB: Date) => {
    const today = new Date();
    const birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const validateDate = (date: Date) => {
      let error = '';
      const age = getAge(date);
      if (age < 13) {
        error = 'Có vẻ như bạn đã nhập sai thông tin. Hãy đảm bảo sử dụng ngày sinh thật của mình.';
      }
      setError(error);
      setIsFormValid(error === '');
    };
    validateDate(date);
  }, [date]);
  return (
    <WrapperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={styles.title}>
        Sinh nhật của bạn khi nào?
      </Text>
      <Text variant='bodyMedium' style={styles.errorMessage}>
        {error}
      </Text>
      <DatePicker
        style={styles.datePicker}
        androidVariant='nativeAndroid'
        mode='date'
        date={date}
        onDateChange={setDate}
      />
      <BaseButton disabled={!isFormValid} onPress={handleSubmit}>
        Tiếp
      </BaseButton>
    </WrapperAuthScreen>
  );
}
export default DatePickerScreen;
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  errorMessage: {
    textAlign: 'center',
    alignSelf: 'center',
    color: color.error
  },
  datePicker: {
    marginBottom: 80,
    alignSelf: 'center'
  }
});

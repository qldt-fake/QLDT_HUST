import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';

import WraperAuthScreen from 'src/components/WraperScreen';
import BaseInputText from 'src/components/BaseInputText';
import BaseButton from 'src/components/BaseButton';
import BaseTextTitle from 'src/components/BaseTextTitle';
import { color } from 'src/common/constants/color';
import BaseForm from 'src/components/BaseForm';
import { nameFormSchema } from 'src/validation/signUp.validate';
import { INameScreenForm } from 'src/interfaces/auth.interface';

function NameScreen() {
  const naviagtion: NavigationProp<AuthNavigationType, 'BirthdayScreen'> = useNavigation();
  const methods = useForm({ resolver: yupResolver(nameFormSchema) });
  const { handleSubmit } = methods;
  const onPressNextButton = (data: INameScreenForm) => {
    naviagtion.navigate('BirthdayScreen', data);
  };
  return (
    <WraperAuthScreen spaceBetween linnerGradient>
      <View style={{ flex: 1, flexDirection: 'column', gap: 10 }}>
        <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
          Bạn tên gì?
        </Text>
        <Text variant='bodyMedium'>Nhập tên bạn sử dụng trong đời thực.</Text>
        <BaseForm methods={methods}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <BaseInputText mode='outlined' label='Họ' style={{ width: 165 }} name='firstname' />
            <BaseInputText mode='outlined' label='Tên' style={{ width: 165 }} name='lastname' />
          </View>
        </BaseForm>
        <BaseButton onPress={handleSubmit(onPressNextButton)}>Tiếp</BaseButton>
      </View>
      <BaseTextTitle color={color.primary} onPress={() => naviagtion.navigate('Login' as never)}>
        Bạn đã có tài khoản ư?
      </BaseTextTitle>
    </WraperAuthScreen>
  );
}

export default NameScreen;

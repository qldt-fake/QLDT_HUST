import { Text } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import WraperAuthScreen from 'src/components/WraperScreen';
import BaseInputPassword from 'src/components/BaseInputPassword';
import BaseButton from 'src/components/BaseButton';
import BaseForm from 'src/components/BaseForm';
import { IPasswordScreenForm } from 'src/interfaces/auth.interface';
import { passwordFormSchema } from 'src/validation/signUp.validate';

function PasswordScreen() {
  const navigation: NavigationProp<AuthNavigationType, 'ConfirmPolicyScreen'> = useNavigation();
  const route: RouteProp<AuthNavigationType, 'PasswordScreen'> = useRoute();
  const methods = useForm({ resolver: yupResolver(passwordFormSchema) });
  const { handleSubmit } = methods;
  const onPressNextButton = (data: IPasswordScreenForm) => {
    navigation.navigate('ConfirmPolicyScreen', {
      ...route.params,
      ...data
    });
  };
  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
        Tạo mật khẩu
      </Text>
      <Text variant='bodyMedium'>
        Tạo mật khẩu gồm ít nhất 6 chữ cái hoặc chữ số.
        {'\n'}
        Bạn nên chọn mật khẩu thật khó đoán.
      </Text>
      <BaseForm methods={methods}>
        <BaseInputPassword mode='outlined' label='Mật khẩu' name='password' />
      </BaseForm>
      <BaseButton onPress={handleSubmit(onPressNextButton)}>Tiếp</BaseButton>
    </WraperAuthScreen>
  );
}

export default PasswordScreen;

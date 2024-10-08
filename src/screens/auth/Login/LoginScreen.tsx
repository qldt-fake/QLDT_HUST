import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import { yupResolver } from '@hookform/resolvers/yup';
import { getUniqueId } from 'react-native-device-info';
import BaseModalError from 'src/components/BaseModalError';

import BaseButton from 'src/components/BaseButton';
import BaseInputPassword from 'src/components/BaseInputPassword';
import BaseInputEmail from 'src/components/BaseInputEmail';
import BaseTextTitle from 'src/components/BaseTextTitle';
import BaseMetaLogo from 'src/components/BaseMetaLogo';
import WraperAuthScreen from 'src/components/WraperScreen';
import BaseForm from 'src/components/BaseForm';
import styles from './styles';
import { ILoginData } from 'src/interfaces/auth.interface';
import { loginFormSchema } from 'src/validation/login.validate';
import { deleteErrorMessage, login, selectAuth } from 'src/redux/slices/authSlice';
import { useAppSelector, useAppDispatch } from 'src/redux';

function LoginScreen() {
  const navigation = useNavigation();
  const methods = useForm({ resolver: yupResolver(loginFormSchema) });

  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const { handleSubmit, setValue } = methods;

  const onSubmit = async (data: ILoginData) => {
    const uuid = await getUniqueId();
    dispatch(login({ ...data, uuid }));
  };

  const onBackdropPress = () => {
    dispatch(deleteErrorMessage());
    setValue('password', '');
  };

  const onNavigateForgotPasswordScreen = () => navigation.navigate('ForgotPasswordScreen' as never);
  return (

    <WraperAuthScreen spaceBetween linnerGradient>
      <View style={styles.logo}>
        <Avatar.Image source={require('src/assets/logo.png')} size={55} />
      </View>

      <BaseForm methods={methods}>
        <View style={styles.formGroup}>
          <BaseInputEmail
            hideLabel 
            label='Email'
            mode='outlined'
            name='email'
            rules={{ required: 'email is required' }}
          />
          <BaseInputPassword hideLabel label='Mật khẩu' mode='outlined' name='password' />
          <BaseButton  style={{ marginTop: 16 }}  width={350} onPress={handleSubmit(onSubmit)} loading={auth.isLoading}>
            Đăng nhập
          </BaseButton>
          <BaseTextTitle color='white' onPress={onNavigateForgotPasswordScreen}>
            Bạn quên mật khẩu ư? 
          </BaseTextTitle>
        </View>
      </BaseForm>
      <View style={styles.bottom}>
        <BaseButton
          width={350}
          mode='outlined'
          onPress={() => navigation.navigate('FirstScreen' as never)}
        >
          Tạo tài khoản mới
        </BaseButton>
        {/* <BaseMetaLogo /> */}
      </View>
      <BaseModalError
        isVisible={!!auth.error}
        onBackdropPress={onBackdropPress}
        title={auth.error as string}
      />
    </WraperAuthScreen>
  );
}
export default LoginScreen;

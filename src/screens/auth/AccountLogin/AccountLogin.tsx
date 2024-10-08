import { View, StyleSheet, Image, Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { yupResolver } from '@hookform/resolvers/yup';
import { getUniqueId } from 'react-native-device-info';
import BaseModalError from 'src/components/BaseModalError';
import * as yup from 'yup';

import BaseButton from 'src/components/BaseButton';
import BaseInputPassword from 'src/components/BaseInputPassword';
import BaseTextTitle from 'src/components/BaseTextTitle';
import WraperAuthScreen from 'src/components/WraperScreen';
import BaseForm from 'src/components/BaseForm';
import { deleteErrorMessage, login, selectAuth } from 'src/redux/slices/authSlice';
import { useAppSelector, useAppDispatch } from 'src/redux';
import { AuthNavigationName } from 'src/common/constants/nameScreen';
import { getAvatarUri } from 'src/utils/helper';

export const loginFormSchema = yup.object({
  password: yup.string().min(6).required()
});

function AccountLogin() {
  const navigation = useNavigation();
  const routes: RouteProp<AuthNavigationType, AuthNavigationName.AccountLogin> = useRoute();
  const { avatar, email, username } = routes.params;
  const methods = useForm({ resolver: yupResolver(loginFormSchema) });

  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const { handleSubmit, setValue } = methods;

  const onSubmit = async (data: { password: string }) => {
    const uuid = await getUniqueId();
    Keyboard.dismiss();
    dispatch(login({ ...data, uuid, email }));
  };

  const onBackdropPress = () => {
    dispatch(deleteErrorMessage());
    setValue('password', '');
  };

  const onNavigateForgotPasswordScreen = () => navigation.navigate('ForgotPasswordScreen' as never);
  return (
    <WraperAuthScreen spaceBetween linnerGradient>
      <BaseForm methods={methods}>
        <View style={styles.formGroup}>
          <View style={styles.userInfo}>
            <Image source={getAvatarUri(avatar)} style={styles.avatar} />
            <Text variant='titleMedium' style={styles.username}>
              {username}
            </Text>
          </View>
          <BaseInputPassword label='Mật khẩu' mode='outlined' name='password' />
          <BaseButton width={350} onPress={handleSubmit(onSubmit)} loading={auth.isLoading}>
            Đăng nhập
          </BaseButton>
        </View>
      </BaseForm>
      <BaseTextTitle onPress={onNavigateForgotPasswordScreen}>Bạn quên mật khẩu ư?</BaseTextTitle>
      <BaseModalError
        isVisible={!!auth.error}
        onBackdropPress={onBackdropPress}
        title={auth.error as string}
      />
    </WraperAuthScreen>
  );
}

const styles = StyleSheet.create({
  userInfo: { marginTop: 50 },
  avatar: { width: 100, height: 100, borderRadius: 4, alignSelf: 'center' },
  username: { textAlign: 'center', fontSize: 20, marginVertical: 10 },
  formGroup: {
    flex: 2,
    flexDirection: 'column',
    gap: 8
  },

  bottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 4
  }
});

export default AccountLogin;

import { Image, View } from 'react-native';
import WraperAuthScreen from 'src/components/WraperScreen';
import BaseButton from 'src/components/BaseButton';
import { color } from 'src/common/constants/color';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import BaseForm from 'src/components/BaseForm';
import BaseInputEmail from 'src/components/BaseInputEmail';
import BaseInputPassword from 'src/components/BaseInputPassword'
import BaseInputText from 'src/components/BaseInputText';
import { signUpFormSchema } from 'src/validation/login.validate';
import styles from './styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import BaseModalError from 'src/components/BaseModalError';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { deleteErrorMessage, login, selectAuth } from 'src/redux/slices/authSlice';
import { getUniqueId } from 'react-native-device-info';
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';
import RoleRadioOptinons from 'src/components/RolesOption/RoleRadioOptions';
import { useState } from 'react';
import { signUpApi } from 'src/services/auth.services';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { NO_DATA, USER_IS_EXISTED } from 'src/common/constants/responseCode';
import BaseModalSuccess from 'src/components/BaseModalSuccess';
import * as yup from 'yup';

function FirstScreen() {
  const navigation = useNavigation();
  const methods = useForm({ resolver: yupResolver(signUpFormSchema) });
  const { handleSubmit, setValue } = methods;
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [textError, setTextError] = useState<string>('');
  const [textSuccess, setTextSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const naviagion: NavigationProp<AuthNavigationType, 'VerifyOTPScreen'> = useNavigation();
  const [verifyCode, setVerifyCode] = useState('')
  const [emailUser, setEmailUser] = useState('')
  const [passwordUser, setPasswordUser] = useState('')
  const onSubmit = async (data: any) => {
    try {
      const uuid = await getUniqueId();
      setIsLoading(true);
      const { ho, ten, email, password, role } = data;
      const res = await signUpApi({ ho, ten, email, password, uuid, role });
      
      if (!res.success) {
        if (res.code === USER_IS_EXISTED) return setTextError('Tài khoản đã tồn tại');
        if (res.code === NO_DATA) return setTextError(res.message);
      }
      else {
        setVerifyCode(res.verify_code || '')
        setEmailUser(email)
        setTextSuccess("Đăng ký thành công");
        setPasswordUser(password)
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setTextError('server availability');
    }
    finally {
      setIsLoading(false)
    }
  };
  const handleOkPress = () => {
    naviagion.navigate('VerifyOTPScreen', { email: emailUser, verifyCode: verifyCode, password: passwordUser });
  }
  const onBackdropPress = () => {
    setTextError('');
    setIsLoading(false);
  };

  return (
    <WraperAuthScreen spaceBetween linnerGradient>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <BaseForm methods={methods}>
            <View style={styles.formGroup}>
              <BaseInputText hideLabel name='ho' label='Họ' mode='outlined' />
              <BaseInputText hideLabel name='ten' label='Tên' mode='outlined' />
              <BaseInputEmail
                hideLabel
                label='Email'
                mode='outlined'
                name='email'
                rules={{ required: 'email is required' }}
              />
              <BaseInputPassword hideLabel label='Mật khẩu' mode='outlined' name='password' />
              <BaseInputPassword hideLabel label='Nhập lại mật khẩu' mode='outlined' name='repassword' />
              <WrapperRolesOption>
                <RoleRadioOptinons name='role' />
              </WrapperRolesOption>
              <BaseButton style={{ marginTop: 16 }} width={350} onPress={handleSubmit(onSubmit)} loading={isLoading}>
                Đăng ký
              </BaseButton>
            </View>
          </BaseForm>
        </ScrollView>
      </KeyboardAvoidingView>
      <BaseModalError title={textError} isVisible={!!textError} onBackdropPress={onBackdropPress} />
      <BaseModalSuccess title={textSuccess} isVisible={!!textSuccess} onOkPress={handleOkPress} // Truyền hàm vào prop này
      />
    </WraperAuthScreen>
  );
}


const WrapperRolesOption = styled.View<ViewProps>`
  padding: 16px 10px;
  background-color: ${color.white};
  border-radius: 8px;
  margin: 16px 0;
`;

export default FirstScreen;

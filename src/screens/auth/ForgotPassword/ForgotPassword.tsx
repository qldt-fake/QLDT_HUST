import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';

import BaseButton from 'src/components/BaseButton';
import BaseInputEmail from 'src/components/BaseInputEmail';
import BaseForm from 'src/components/BaseForm';
import WraperAuthScreen from 'src/components/WraperScreen';
import BaseInputPassword from 'src/components/BaseInputPassword';
import BaseInputNumber from 'src/components/BaseInputNumber';
import { color } from 'src/common/constants/color';
import BaseModalError from 'src/components/BaseModalError';
import { getVerifyCodeApi, resetPasswordApi } from 'src/services/auth.services';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import BaseTextTitle from 'src/components/BaseTextTitle';
import { emailFormSchema } from 'src/validation/signUp.validate';

export interface IFogetPassworData {
  email: string;
  password?: string;
  otp?: string;
}

export const forgotPasswordFormSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  otp: yup.string().required()
});

function ForgetPassword() {
  const [textError, setTextError] = useState<string>('');
  const [isEmailExits, setIsEmailExits] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingGetCode, setIsLoadingGetCode] = useState<boolean>(false);
  const [formSchema, setFormSchema] = useState(forgotPasswordFormSchema);

  useEffect(() => {
    if (isEmailExits) {
      setFormSchema(forgotPasswordFormSchema);
    } else {
      setFormSchema(emailFormSchema as typeof forgotPasswordFormSchema);
    }
  }, [isEmailExits]);

  const methods = useForm({ resolver: yupResolver(formSchema) });
  const { handleSubmit, setValue } = methods;
  const navigation: NavigationProp<AuthNavigationType> = useNavigation();

  const onResetPassword = async (data: IFogetPassworData) => {
    try {
      setIsLoading(true);
      const res = await resetPasswordApi({
        email: data.email,
        password: data.password as string,
        code: data.otp as string
      });
      if (!res.success) {
        return setTextError(res.message);
      }
      setIsLoading(false);
      navigation.goBack();
    } catch (err) {
      setTextError('Có lỗi xảy ra.Vui lòng thực hiện lại');
    }
  };

  const onGetVerifyCode = async (data: IFogetPassworData) => {
    try {
      setIsLoadingGetCode(true);
      const res = await getVerifyCodeApi({ email: data.email });
      if (!res.success) {
        return setTextError("lỗi");
      }
      setValue('otp', res.data);
      setIsLoadingGetCode(false);
      setIsEmailExits(true);
    } catch (err) {
      setTextError('Có lỗi xảy ra.Vui lòng thực hiện lại');
    }
  };

  const onBackdropPress = () => {
    setTextError('');
    setIsLoading(false);
    setIsLoadingGetCode(false);
  };

  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleMedium' style={{ fontSize: 16, fontWeight: 'bold' , color:'white' }}>
        Quên mật khẩu
      </Text>
      <BaseForm methods={methods}>
        <BaseInputEmail hideLabel  mode='outlined' label='Email' name='email' disabled={isEmailExits} />
        {isEmailExits ? (
          <>
            <BaseInputPassword mode='outlined' label='Mật khẩu mới' name='password' />
            <BaseInputNumber mode='outlined' label='Mã OTP' name='otp' />
          </>
        ) : (
          <></>
        )}
      </BaseForm>
      <BaseButton
        onPress={isEmailExits ? handleSubmit(onResetPassword) : handleSubmit(onGetVerifyCode)}
        loading={isLoading || (!isEmailExits && isLoadingGetCode)}
      >
        {isEmailExits ? 'Đổi mật khẩu' : 'Tìm tài khoản'}
      </BaseButton>
      {isEmailExits && (
        <>
          <BaseButton
            mode='outlined'
            isUseTextOutlineColor
            textColor={color.textColor}
            borderColor={color.outlineColor}
            loading={isLoadingGetCode}
            onPress={handleSubmit(onGetVerifyCode)}
          >
            Gửi lại OTP
          </BaseButton>
          <BaseTextTitle onPress={() => setIsEmailExits(false)}>
            Bạn muốn dùng email khác?
          </BaseTextTitle>
        </>
      )}
      <BaseModalError title={textError} isVisible={!!textError} onBackdropPress={onBackdropPress} />
    </WraperAuthScreen>
  );
}

export default ForgetPassword;

import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { View } from 'react-native';

import WraperAuthScreen from 'src/components/WraperScreen';
import BaseInputNumber from 'src/components/BaseInputNumber';
import BaseButton from 'src/components/BaseButton';
import { color } from 'src/common/constants/color';
import BaseForm from 'src/components/BaseForm';
import { otpFormSchema } from 'src/validation/signUp.validate';
import { IVerifyOtpSceenForm } from 'src/interfaces/auth.interface';
import { useCallback, useEffect, useState } from 'react';
import { checkVerifyCodeApi, getVerifyCodeApi } from 'src/services/auth.services';
import BaseModalError from 'src/components/BaseModalError';
import BaseTextTitle from 'src/components/BaseTextTitle';
import BaseModalLoading from 'src/components/BaseModalLoading/BaseModalLoading';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { logout, modifyAccountAtivity, selectAuth } from 'src/redux/slices/authSlice';
import { AccountStatus } from 'src/common/enum/commom';

function VerifyOTPAfterLogin() {
  const [textError, setTextError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmVerifyOTP, setIsConfirmVerifyOTP] = useState<boolean>(false);
  const [isLoadingGetCode, setIsLoadingGetCode] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const methods = useForm({ resolver: yupResolver(otpFormSchema) });
  const { handleSubmit, setValue } = methods;

  const onGetVerifyCode = useCallback(async () => {
    try {
      setIsLoadingGetCode(true);
      const res = await getVerifyCodeApi({ email: auth.user?.email as string });
      if (!res.success) {
        return setTextError(res.message);
      }
      setValue('otpCode', res.data.verify_code);
      setIsLoadingGetCode(false);
    } catch (err) {
      setTextError('server availability');
    }
  }, [auth.user?.email, setValue]);

  useEffect(() => {
    onGetVerifyCode();
  }, [onGetVerifyCode]);

  const onPressButton = async (data: IVerifyOtpSceenForm) => {
    try {
      setIsLoading(true);
      const res = await checkVerifyCodeApi({
        code_verify: data.otpCode,
        email: auth.user?.email as string
      });
      if (!res.success) {
        return setTextError(res.message);
      }
      dispatch(modifyAccountAtivity(AccountStatus.Pending));
      setIsLoading(false);
    } catch (err) {
      setTextError('Dịch vụ chưa sẵn sàng');
    }
  };

  const onPressLogout = () => {
    dispatch(logout());
  };
  const onBackdropPress = () => {
    setTextError('');
    setIsLoading(false);
    setIsLoadingGetCode(false);
  };
  return (
    <WraperAuthScreen spaceBetween>
      {isConfirmVerifyOTP ? (
        <View style={{ gap: 10 }}>
          <Text variant='titleLarge' style={{ fontWeight: 'bold', paddingTop: 40 }}>
            Nhập mã xác nhận
          </Text>
          <Text variant='bodyMedium'>
            Để xác nhận tài khoản, hãy nhập mã số gồm 6 chứ số mà chúng tôi đã gửi đến số
          </Text>
          <BaseForm methods={methods}>
            <BaseInputNumber mode='outlined' label='Mã xác nhận' name='otpCode' />
          </BaseForm>
          <BaseButton onPress={handleSubmit(onPressButton)} loading={isLoading}>
            Tiếp
          </BaseButton>
          <BaseButton
            mode='outlined'
            isUseTextOutlineColor
            textColor={color.textColor}
            borderColor={color.outlineColor}
            loading={isLoadingGetCode}
            onPress={onGetVerifyCode}
          >
            Tôi không nhận được mã
          </BaseButton>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <Text variant='titleLarge' style={{ fontWeight: 'bold', paddingTop: 40 }}>
            Tài khoản chưa kích hoạt
          </Text>
          <Text variant='bodyMedium'>
            Có vẻ như tài khoản của bạn chưa được kích hoạt sau khi đăng kí. Vui lòng kích hoạt tài
            khoản bằng mã OTP được gửi về email hoặc số điện thoại được đăng kí
          </Text>
          <BaseButton onPress={() => setIsConfirmVerifyOTP(true)}>Đồng ý</BaseButton>
        </View>
      )}
      <BaseModalError title={textError} isVisible={!!textError} onBackdropPress={onBackdropPress} />
      <BaseTextTitle onPress={onPressLogout}>Bạn có tài khoản khác?</BaseTextTitle>
      <BaseModalLoading isVisible={auth.isLoading} />
    </WraperAuthScreen>
  );
}

export default VerifyOTPAfterLogin;

import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';

import WraperAuthScreen from 'src/components/WraperScreen';
import BaseInputNumber from 'src/components/BaseInputNumber';
import BaseButton from 'src/components/BaseButton';
import { color } from 'src/common/constants/color';
import BaseForm from 'src/components/BaseForm';
import { otpFormSchema } from 'src/validation/signUp.validate';
import { IVerifyOtpSceenForm } from 'src/interfaces/auth.interface';
import { useEffect, useState } from 'react';
import { checkVerifyCodeApi, getVerifyCodeApi } from 'src/services/auth.services';
import BaseModalError from 'src/components/BaseModalError';

function VerifyOTPScreen() {
  const [textError, setTextError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingGetCode, setIsLoadingGetCode] = useState<boolean>(false);
  const navigation: NavigationProp<AuthNavigationType, 'SaveInfoAccountScreen'> = useNavigation();
  const route: RouteProp<AuthNavigationType, 'VerifyOTPScreen'> = useRoute();
  const { email } = route.params;
  const methods = useForm({ resolver: yupResolver(otpFormSchema) });
  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    setValue('otpCode', route.params.verifyCode);
  }, [setValue, route]);

  const onPressButton = async (data: IVerifyOtpSceenForm) => {
    try {
      setIsLoading(true);
      const res = await checkVerifyCodeApi({ code_verify: data.otpCode, email: email });
      if (!res.success) {
        return setTextError(res.message);
      }
      navigation.navigate('SaveInfoAccountScreen');
      setIsLoading(false);
    } catch (err) {
      setTextError('Dịch vụ chưa sẵn sàng');
    }
  };

  const onGetVerifyCode = async () => {
    try {
      setIsLoadingGetCode(true);
      const res = await getVerifyCodeApi({ email });
      if (!res.success) {
        return setTextError(res.message);
      }
      setValue('otpCode', res.data.verify_code);
      setIsLoadingGetCode(false);
    } catch (err) {
      setTextError('server availability');
    }
  };

  const onBackdropPress = () => {
    setTextError('');
    setIsLoading(false);
    setIsLoadingGetCode(false);
  };
  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
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
      <BaseModalError title={textError} isVisible={!!textError} onBackdropPress={onBackdropPress} />
    </WraperAuthScreen>
  );
}

export default VerifyOTPScreen;

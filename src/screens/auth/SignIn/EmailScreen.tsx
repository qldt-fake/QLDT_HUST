import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';

import BaseButton from 'src/components/BaseButton';
import BaseInputEmail from 'src/components/BaseInputEmail';
import { color } from 'src/common/constants/color';
import BaseForm from 'src/components/BaseForm';
import { IEmailScreenForm } from 'src/interfaces/auth.interface';
import WraperAuthScreen from 'src/components/WraperScreen';
import { emailFormSchema } from 'src/validation/signUp.validate';
import { useState } from 'react';
import { checkEmailApi } from 'src/services/auth.services';
import { ExistedEmail } from 'src/common/enum/commom';
import BaseModalError from 'src/components/BaseModalError';

function EmailScreen() {
  const methods = useForm({ resolver: yupResolver(emailFormSchema) });

  const [errorMessage, setErrorMessage] = useState<string>('');

  const { handleSubmit, setValue } = methods;
  const navigation: NavigationProp<AuthNavigationType, 'PasswordScreen'> = useNavigation();
  const route: RouteProp<AuthNavigationType, 'EmailScreen'> = useRoute();
  const onPressNextButton = async (data: IEmailScreenForm) => {
    try {
      const res = await checkEmailApi({ email: data.email });
      if (!res.success) {
        return setErrorMessage(res.message);
      }
      if (res.data.existed === ExistedEmail.IsExisted) {
        setErrorMessage('Email đã tồn tại. Vui lòng chọn email khác');
        setValue('email', '');
        return;
      }
      return navigation.navigate('PasswordScreen', {
        ...route.params,
        ...data
      });
    } catch (err) {
      setErrorMessage('Vui lòng kiểm tra kết nối internet');
    }
  };

  const onBackdropPress = () => setErrorMessage('');

  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
        Email của bạn là gì?
      </Text>
      <Text variant='bodyMedium'>
        Nhập email có thể dùng để liên hệ với bạn. Thông tin này sẽ không hiển thị với ai khác trên
        trang cá nhân của bạn.
      </Text>
      <BaseForm methods={methods}>
        <BaseInputEmail mode='outlined' label='Email' name='email' />
      </BaseForm>
      <Text variant='bodySmall'>
        Bạn cũng sẽ nhận được email của chúng tôi và có thể chọn không nhận bất cứ lúc nào.
      </Text>
      <BaseButton onPress={handleSubmit(onPressNextButton)}>Tiếp</BaseButton>
      <BaseButton
        mode='outlined'
        borderColor={color.outlineColor}
        textColor={color.textColor}
        isUseTextOutlineColor
      >
        Đăng nhập bằng số di động
      </BaseButton>
      <BaseModalError
        isVisible={!!errorMessage}
        onBackdropPress={onBackdropPress}
        title={errorMessage}
      />
    </WraperAuthScreen>
  );
}

export default EmailScreen;

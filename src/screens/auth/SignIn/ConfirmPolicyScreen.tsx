import { Text } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { getUniqueId } from 'react-native-device-info';

import WraperAuthScreen from 'src/components/WraperScreen';
import BaseButton from 'src/components/BaseButton';
import { signUpApi } from 'src/services/auth.services';
import BaseModalError from 'src/components/BaseModalError';

function ConfirmPolicyScreen() {
  const [textError, setTextError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const naviagion: NavigationProp<AuthNavigationType, 'VerifyOTPScreen'> = useNavigation();
  const route: RouteProp<AuthNavigationType, 'ConfirmPolicyScreen'> = useRoute();
  const handleSubmit = async () => {
    try {
      const uuid = await getUniqueId();
      const { email, password } = route.params;
      setIsLoading(true);
      const res = await signUpApi({ email, password, uuid });
      if (!res.success) {
        return setTextError(res.message);
      }
      const verifyCode = res.data.verify_code;
      naviagion.navigate('VerifyOTPScreen', { verifyCode, email });
      setIsLoading(false);
    } catch (err) {
      setTextError('server availability');
    }
  };
  const onBackdropPress = () => {
    setTextError('');
    setIsLoading(false);
  };
  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
        Đồng ý với điều khoản và chính sách của Fakebook
      </Text>
      <Text variant='bodyMedium'>
        Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin của bạn lên Fakebook.Tìm hiểu
        thêm.
      </Text>
      <Text variant='bodyMedium'>
        Bằng cách nhấn vào Tôi đồng ý. Bạn đã đồng ý tạo tài khoản cũng như chấp thuận Điều khoản,
        Chính sách quyền riêng tư và Chính sách cookie của Fakebook.
      </Text>
      <Text variant='bodyMedium'>
        Chính sách quyền riêng tư mô tả các cách chúng tôi có thể dùng thông tin thu thập được khi
        bạn tạo tài khoản. Chẳng hạn chúng tôi sử dụng thông tin này để cung cấp, cá nhân hóa và cải
        thiện các sản phẩm của mình bao gồm quảng cáo.
      </Text>
      <BaseButton onPress={handleSubmit} loading={isLoading}>
        Tôi đồng ý
      </BaseButton>
      <BaseModalError title={textError} isVisible={!!textError} onBackdropPress={onBackdropPress} />
    </WraperAuthScreen>
  );
}

export default ConfirmPolicyScreen;

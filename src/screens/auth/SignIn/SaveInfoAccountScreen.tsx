import { Text } from 'react-native-paper';

import BaseButton from 'src/components/BaseButton';
import WraperAuthScreen from 'src/components/WraperScreen';
import { color } from 'src/common/constants/color';
import { NavigationProp, useNavigation } from '@react-navigation/native';

function SaveInfoAccountScreen() {
  const navigation: NavigationProp<AuthNavigationType, 'Login'> = useNavigation();
  const onPressSaveButton = () => {
    navigation.navigate('Login');
  };
  const onPressAfterButton = () => {
    navigation.navigate('Login');
  };
  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
        Lưu thông tin đăng nhập?
      </Text>
      <Text variant='bodyMedium'>
        Chúng tôi sẽ lưu thông tin đăng nhập cho để bạn không cần nhập vào lần sau.
      </Text>
      <BaseButton onPress={onPressSaveButton}>Lưu</BaseButton>
      <BaseButton
        mode='outlined'
        borderColor={color.outlineColor}
        textColor={color.textColor}
        isUseTextOutlineColor
        onPress={onPressAfterButton}
      >
        Lúc khác
      </BaseButton>
    </WraperAuthScreen>
  );
}

export default SaveInfoAccountScreen;

import { Text } from 'react-native-paper';

import BaseButton from 'src/components/BaseButton';
import WraperAuthScreen from 'src/components/WraperScreen';
import { color } from 'src/common/constants/color';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { login, selectAuth } from 'src/redux/slices/authSlice';
import { AuthNavigationName } from 'src/common/constants/nameScreen';
import { getUniqueId } from 'react-native-device-info';
function SaveInfoAccountScreen() {
  const auth = useAppSelector(selectAuth);
  const routes: RouteProp<AuthNavigationType, AuthNavigationName.SaveInfoAccountScreen> =
    useRoute();
  const { email, password } = routes.params;
  const dispatch = useAppDispatch();
  const navigation: NavigationProp<AuthNavigationType, 'Login'> = useNavigation();
  const onPressSaveButton = async () => {
    const deviceId = await getUniqueId();
    dispatch(login({ password, deviceId, email }));
  };
  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={{ fontWeight: 'bold', color: color.white }}>
        Lưu thông tin đăng nhập?
      </Text>
      <Text variant='bodyMedium' style={{ color: color.white }}>
        Chúng tôi sẽ lưu thông tin đăng nhập cho để bạn không cần nhập vào lần sau.
      </Text>
      <BaseButton onPress={onPressSaveButton} loading={auth.isLoading}>
        Lưu
      </BaseButton>
    </WraperAuthScreen>
  );
}

export default SaveInfoAccountScreen;

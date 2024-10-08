import { Text } from 'react-native-paper';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { ViewProps } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import WraperAuthScreen from 'src/components/WraperScreen';
import BaseButton from 'src/components/BaseButton';
import styled from 'styled-components/native';
import GenderRadioGroup from 'src/components/GenderRadioGroup';
import { color } from 'src/common/constants/color';
import BaseForm from 'src/components/BaseForm';
import { IGenderScreenForm } from 'src/interfaces/auth.interface';
import { genderFormShema } from 'src/validation/signUp.validate';

function GenderScreen() {
  const navigation: NavigationProp<AuthNavigationType, 'EmailScreen'> = useNavigation();
  const route: RouteProp<AuthNavigationType, 'GenderScreen'> = useRoute();

  const methods = useForm({ resolver: yupResolver(genderFormShema) });
  const { handleSubmit } = methods;
  const onPressNextButton = (data: IGenderScreenForm) => {
    navigation.navigate('EmailScreen', {
      ...route.params,
      ...data
    });
  };
  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
        Bạn giới tính là gì?
      </Text>
      <Text variant='bodyMedium'>
        Bạn có thể thay đổi người nhìn thấy giới tính của mình trên trang cá nhân vào lúc khác.
      </Text>
      <BaseForm methods={methods}>
        <WrapperGenderOption>
          <GenderRadioGroup name='gender' />
        </WrapperGenderOption>
      </BaseForm>
      <BaseButton onPress={handleSubmit(onPressNextButton)}>Tiếp</BaseButton>
    </WraperAuthScreen>
  );
}
const WrapperGenderOption = styled.View<ViewProps>`
  padding: 16px 10px;
  background-color: ${color.white};
  border-radius: 8px;
  margin: 16px 0;
`;
export default GenderScreen;

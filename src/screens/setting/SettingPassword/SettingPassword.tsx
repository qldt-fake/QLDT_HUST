import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { color } from 'src/common/constants/color';
import BaseButton from 'src/components/BaseButton';
import BaseForm from 'src/components/BaseForm';
import BaseInputPassword from 'src/components/BaseInputPassword';
import { Text } from 'react-native-paper';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import BaseModalError from 'src/components/BaseModalError';
import { changPasswordApi } from 'src/services/auth.services';
import { useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { saveTokenIntoKeychain } from 'src/utils/kechain';

const SUCCESS_MESSAGE: string = 'Thành công';

const changPasswordSchema = yup.object({
  currPassword: yup
    .string()
    .min(6, 'Mật khẩu ít nhất 6 kí tự')
    .required('Vui lòng nhập mật khẩu hiện tại'),
  newPassword: yup.string().min(6, 'Mật khẩu ít nhất 6 kí tự').required('Vui lòng nhập mật khẩu'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận lại mật khẩu')
});

interface IChangePassword {
  currPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

function SettingPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>('');

  const navigation: NavigationProp<SettingNavigationType> = useNavigation();
  const auth = useAppSelector(selectAuth);

  const onPressCancelButton = () => navigation.goBack();
  const methods = useForm({ resolver: yupResolver(changPasswordSchema) });
  const { handleSubmit } = methods;
  const onSubmit = async (data: IChangePassword) => {
    try {
      setIsLoading(true);
      const res = await changPasswordApi({
        password: data.currPassword,
        new_password: data.newPassword
      });
      if (!res.success) {
        setAlertText(res.message);
        return;
      }
      await saveTokenIntoKeychain(auth.user?.id as string, res.data.token);
      setAlertText(SUCCESS_MESSAGE);
    } catch (err) {
      setAlertText('Vui lòng kiểm tra kết nối internet');
    }
  };

  const onBackdropPressModal = () => {
    if (alertText === SUCCESS_MESSAGE) {
      setAlertText('');
      setIsLoading(false);
      return navigation.goBack();
    }
    setAlertText('');
    setIsLoading(false);
  };
  return (
    <>
      <BaseForm methods={methods}>
        <View style={{ padding: 10 }}>
          <BaseInputPassword
            placeholder='Mật khẩu hiện tại'
            mode='flat'
            name='currPassword'
            style={{ backgroundColor: color.sureface }}
            underlineColor={color.activeOutlineColor}
            activeUnderlineColor={color.activeOutlineColor}
          />
          <BaseInputPassword
            placeholder='Mật khẩu mới'
            mode='flat'
            name='newPassword'
            style={{ backgroundColor: color.sureface }}
            underlineColor={color.activeOutlineColor}
            activeUnderlineColor={color.activeOutlineColor}
          />
          <BaseInputPassword
            placeholder='Gõ lại mật khẩu'
            mode='flat'
            name='confirmNewPassword'
            style={{ backgroundColor: color.sureface }}
            underlineColor={color.activeOutlineColor}
            activeUnderlineColor={color.activeOutlineColor}
          />

          <BaseButton
            width={350}
            style={{ marginTop: 20 }}
            onPress={handleSubmit(onSubmit)}
            borderRadius={8}
            loading={isLoading}
          >
            Lưu thay đổi
          </BaseButton>
          <BaseButton
            width={350}
            style={{ marginTop: 10 }}
            onPress={onPressCancelButton}
            borderRadius={8}
            buttonColor={color.borderColor}
          >
            Hủy
          </BaseButton>
          <TouchableOpacity activeOpacity={0.7}>
            <Text
              variant='titleSmall'
              style={{ textAlign: 'center', color: color.primary, marginTop: 8 }}
            >
              Quên mật khẩu?
            </Text>
          </TouchableOpacity>
        </View>
      </BaseForm>
      <BaseModalError
        title={alertText}
        isVisible={!!alertText}
        onBackdropPress={onBackdropPressModal}
      />
    </>
  );
}

export default SettingPassword;

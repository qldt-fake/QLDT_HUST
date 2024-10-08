import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { trim } from 'lodash';
import { useEffect } from 'react';
import { FieldValue, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { color } from 'src/common/constants/color';
import BaseButton from 'src/components/BaseButton';
import BaseForm from 'src/components/BaseForm';
import BaseInputText from 'src/components/BaseInputText';
import BaseModalError from 'src/components/BaseModalError';
import { useAppDispatch } from 'src/redux';
import { deleteErrorMessage, selectAuth, setProfile } from 'src/redux/slices/authSlice';
import { setUsername } from 'src/redux/slices/authSlice';
import * as yup from 'yup';

const nameInfoShema = yup.object({
  lastname: yup.string().required(),
  middleName: yup.string().optional(),
  firtname: yup.string().required()
});

export interface INameInfo {
  lastname: string;
  middleName: string;
  firtname: string;
}

function SettingInfoName() {
  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();

  const navigation: NavigationProp<SettingNavigationType> = useNavigation();
  const onPressCancelButton = () => navigation.goBack();
  const methods = useForm({ resolver: yupResolver(nameInfoShema) });
  const { handleSubmit, setValue } = methods;
  useEffect(() => {
    const nameParts = auth.user?.username.split(' ') as string[];
    const lastname = nameParts?.pop();
    const firstname = nameParts?.shift();
    const middlename = nameParts?.join(' ');
    setValue('firtname', firstname as string);
    setValue('middleName', middlename);
    setValue('lastname', lastname as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user?.username]);
  const onSubmit = (data: FieldValue<INameInfo>) => {
    const formData = new FormData();
    const { firtname, lastname, middleName } = data as INameInfo;
    let username: string;
    if (middleName) {
      username = trim(firtname) + ' ' + trim(middleName) + ' ' + trim(lastname);
    } else {
      username = trim(firtname) + ' ' + trim(lastname);
    }
    formData.append('username', username);
    dispatch(setProfile(formData));
    dispatch(setUsername(username));
  };

  const onBackdropPress = () => {
    dispatch(deleteErrorMessage());
  };

  return (
    <>
      <Text style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 10, paddingLeft: 10 }}>
        Tên
      </Text>
      <Divider />
      <BaseForm methods={methods}>
        <View style={{ padding: 10 }}>
          <BaseInputText label='Họ' mode='outlined' name='firtname' hideLabel required />
          <BaseInputText label='Tên đệm' mode='outlined' name='middleName' hideLabel />
          <BaseInputText label='Tên' mode='outlined' name='lastname' hideLabel required />

          <Text
            style={{
              padding: 12,
              marginVertical: 20,
              borderColor: color.borderColor,
              borderWidth: 1,
              borderRadius: 4
            }}
          >
            <Text variant='titleSmall'>Xin lưu ý rằng: </Text>
            <Text variant='bodySmall'>
              Nếu đổi tên trên facebook, bạn không thể đổi lại tên trong 60 ngày. Đừng thêm bất cứ
              cách viết hoa khác thường, dấu cách, ký tự hoặc các từ ngẫu nhiên.{' '}
              <Text style={{ color: color.primary }}>Tìm hiểu thêm</Text>
            </Text>
          </Text>

          <BaseButton
            width={350}
            style={{ marginTop: 10 }}
            onPress={handleSubmit(onSubmit)}
            borderRadius={8}
            loading={auth.isLoading}
          >
            Lưu
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
        </View>
      </BaseForm>
      <BaseModalError
        isVisible={!!auth.error}
        onBackdropPress={onBackdropPress}
        title={auth.error as string}
      />
    </>
  );
}

export default SettingInfoName;

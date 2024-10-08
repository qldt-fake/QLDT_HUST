import BaseSwitch from 'src/components/BaseSwitch';
import BaseForm from 'src/components/BaseForm';
import { useForm } from 'react-hook-form';
import { IListItem } from 'src/interfaces/common.interface';
import { IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { getPushSetting, selectSetting, setPushSetting } from 'src/redux/slices/settingSlice';
import { useEffect } from 'react';
import { booleanReponse } from 'src/common/enum/commom';
import BaseButton from 'src/components/BaseButton/BaseButton';

interface IItem extends IListItem {
  name: string;
  turOnIcon: string;
  turOffIcon: string;
}

function SettingPushNotification() {
  const dispatch = useAppDispatch();
  const settingStore = useAppSelector(selectSetting);
  //  call api ;
  useEffect(() => {
    dispatch(getPushSetting({}));
  }, [dispatch]);

  const methods = useForm();
  const { getValues, setValue, handleSubmit } = methods;
  const listItem: IItem[] = [
    {
      name: 'pushNotification',
      title: 'Tắt thông báo đẩy',
      subtitle: 'Tắt',
      turOffIcon: 'bell-off',
      turOnIcon: 'bell'
    },
    {
      name: 'vibrate',
      title: 'Rung',
      turOffIcon: 'vibrate-off',
      turOnIcon: 'vibrate',
      subtitle: 'Rung khi có thông báo đến'
    },
    {
      name: 'ledLight',
      title: 'Đèn LED điện thoại',
      subtitle: 'Nhấp nháy đền LED khi có thông báo đến',
      turOffIcon: 'flash-off',
      turOnIcon: 'flash'
    },
    {
      name: 'sound',
      title: 'Âm thanh',
      subtitle: 'Phát âm thanh khi có thông báo đến',
      turOffIcon: 'volume-off',
      turOnIcon: 'volume-high'
    },
    {
      name: 'generalMusic',
      title: 'Nhạc chuông',
      subtitle: 'facebook',
      turOffIcon: 'phone-off',
      turOnIcon: 'phone'
    },
    {
      name: 'logoutNotification',
      title: 'Thông báo đã đăng xuất',
      subtitle: 'Nhận thông báo khi đã đăng xuất',
      turOffIcon: 'cellphone-off',
      turOnIcon: 'cellphone'
    }
  ];
  useEffect(() => {
    setValue('pushNotification', settingStore.pushSetting?.notification_on === booleanReponse.True);
    setValue('vibrate', settingStore.pushSetting?.vibrant_on === booleanReponse.True);
    setValue('ledLight', settingStore.pushSetting?.led_on === booleanReponse.True);
    setValue('sound', settingStore.pushSetting?.sound_on === booleanReponse.True);
  }, [settingStore.pushSetting, setValue]);

  const submitSetting = (data: any) => {
    dispatch(
      setPushSetting({
        birthday: settingStore.pushSetting?.birthday as booleanReponse,
        from_friends: settingStore.pushSetting?.from_friends as booleanReponse,
        like_comment: settingStore.pushSetting?.like_comment as booleanReponse,
        report: settingStore.pushSetting?.report as booleanReponse,
        suggested_friend: settingStore.pushSetting?.suggested_friend as booleanReponse,
        requested_friend: settingStore.pushSetting?.requested_friend as booleanReponse,
        video: settingStore.pushSetting?.video as booleanReponse,
        led_on: data.ledLight ? booleanReponse.True : booleanReponse.False,
        notification_on: data.pushNotification ? booleanReponse.True : booleanReponse.False,
        sound_on: data.sound ? booleanReponse.True : booleanReponse.False,
        vibrant_on: data.vibrate ? booleanReponse.True : booleanReponse.False
      })
    );
  };
  return (
    <>
      <BaseForm methods={methods}>
        {listItem.map((item, i) => (
          <BaseSwitch
            key={i}
            name={item.name}
            title={item.title}
            subtitle={item.subtitle}
            left={() => (
              <IconButton
                icon={getValues(item.name) ? item.turOnIcon : item.turOffIcon}
                iconColor={color.textColor}
              />
            )}
          />
        ))}
      </BaseForm>
      <BaseButton
        onPress={handleSubmit(submitSetting)}
        style={{ marginTop: 5, marginHorizontal: 10 }}
        loading={settingStore.loading}
      >
        Lưu
      </BaseButton>
    </>
  );
}

export default SettingPushNotification;

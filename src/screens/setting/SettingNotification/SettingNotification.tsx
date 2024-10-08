import { ScrollView } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { IListItem } from 'src/interfaces/common.interface';
import FunctionItem from '../components/FunctionItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import BaseForm from 'src/components/BaseForm';
import { useForm } from 'react-hook-form';
import BaseSwitch from 'src/components/BaseSwitch';
import { color } from 'src/common/constants/color';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { getPushSetting, selectSetting, setPushSetting } from 'src/redux/slices/settingSlice';
import { useEffect } from 'react';
import BaseButton from 'src/components/BaseButton';
import { booleanReponse } from 'src/common/enum/commom';

export interface ISetPushSettingForm {
  birthday: boolean;
  comment: boolean;
  friendInvitaion: boolean;
  peopleSuggestion: boolean;
  report: boolean;
  update: boolean;
  video: boolean;
}

interface IReciveListItem extends IListItem {
  name: string;
  turOnIcon: string;
  turOffIcon: string;
}

function SettingNotification() {
  const navigation: NavigationProp<SettingNavigationType> = useNavigation();
  const dispatch = useAppDispatch();
  const settingStore = useAppSelector(selectSetting);
  //  call api ;
  useEffect(() => {
    dispatch(getPushSetting({}));
  }, [dispatch]);

  const methods = useForm();
  const { getValues, setValue, handleSubmit } = methods;
  const onPressPushNotification = () => navigation.navigate('SettingPushNotification');
  const listReciveNotifcations: IReciveListItem[] = [
    {
      name: 'comment',
      title: 'Bình luận',
      subtitle: 'Thông báo đẩy,email,SMS',
      turOnIcon: 'message-outline',
      turOffIcon: 'message-off-outline'
    },

    {
      name: 'update',
      title: 'Cập nhật từ bạn bè',
      subtitle: 'Thông báo đẩy,email,SMS',
      turOnIcon: 'account-supervisor-outline',
      turOffIcon: 'account-multiple-remove-outline'
    },
    {
      name: 'friendInvitaion',
      title: 'Lời mời kết bạn',
      subtitle: 'Thông báo đẩy,email,SMS',
      turOnIcon: 'account-plus-outline',
      turOffIcon: 'account-remove-outline'
    },
    {
      name: 'peopleSuggestion',
      title: 'Những người bạn có thể biết',
      subtitle: 'Thông báo đẩy,email,SMS',
      turOnIcon: 'account-network-outline',
      turOffIcon: 'account-off-outline'
    },
    {
      name: 'birthday',
      title: 'Sinh nhật',
      subtitle: 'Thông báo đẩy,email,SMS',
      turOnIcon: 'cake-variant-outline',
      turOffIcon: 'cupcake'
    },
    {
      name: 'video',
      title: 'Video',
      subtitle: 'Thông báo đẩy,email,SMS',
      turOnIcon: 'clipboard-play-outline',
      turOffIcon: 'clipboard-remove-outline'
    },
    {
      name: 'report',
      title: 'Phản hồi báo cáo',
      subtitle: 'Thông báo đẩy,email,SMS',
      turOnIcon: 'sticker-alert-outline',
      turOffIcon: 'sticker-remove-outline'
    }
  ];

  // hiện thị form
  useEffect(() => {
    setValue('comment', settingStore.pushSetting?.like_comment === booleanReponse.True);
    setValue('friendInvitaion', settingStore.pushSetting?.requested_friend === booleanReponse.True);
    setValue('update', settingStore.pushSetting?.from_friends === booleanReponse.True);
    setValue(
      'peopleSuggestion',
      settingStore.pushSetting?.suggested_friend === booleanReponse.True
    );
    setValue('birthday', settingStore.pushSetting?.birthday === booleanReponse.True);
    setValue('video', settingStore.pushSetting?.video === booleanReponse.True);
    setValue('report', settingStore.pushSetting?.report === booleanReponse.True);
  }, [settingStore.pushSetting, setValue]);

  const submitSetting = (data: any) => {
    dispatch(
      setPushSetting({
        birthday: data.birthday ? booleanReponse.True : booleanReponse.False,
        from_friends: data.update ? booleanReponse.True : booleanReponse.False,
        like_comment: data.comment ? booleanReponse.True : booleanReponse.False,
        report: data.report ? booleanReponse.True : booleanReponse.False,
        suggested_friend: data.peopleSuggestion ? booleanReponse.True : booleanReponse.False,
        requested_friend: data.friendInvitaion ? booleanReponse.True : booleanReponse.False,
        video: data.video ? booleanReponse.True : booleanReponse.False,
        led_on: settingStore.pushSetting?.led_on as booleanReponse,
        notification_on: settingStore.pushSetting?.notification_on as booleanReponse,
        sound_on: settingStore.pushSetting?.sound_on as booleanReponse,
        vibrant_on: settingStore.pushSetting?.vibrant_on as booleanReponse
      })
    );
  };

  const listMethodPushNotifications: IListItem[] = [
    {
      title: 'Thông báo đẩy',
      subtitle: 'Bật',
      iconName: 'shape-square-plus',
      onPress: onPressPushNotification
    },
    {
      title: 'Email',
      subtitle: 'Bật gợi ý',
      iconName: 'email-outline'
    },
    {
      title: 'SMS',
      subtitle: 'Không có-Thêm số di động của bạn',
      iconName: 'comment-multiple-outline'
    }
  ];
  const methodLastIndex = listMethodPushNotifications.length - 1;
  const reciveLastIndex = listReciveNotifcations.length - 1;
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      <Text
        style={{ fontSize: 18, fontWeight: 'bold', paddingVertical: 16, paddingHorizontal: 10 }}
      >
        Bạn nhận thông báo về
      </Text>
      <BaseForm methods={methods}>
        {listReciveNotifcations.map((item, i) => (
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
            isDivider={i !== reciveLastIndex}
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
      <Text
        style={{ fontSize: 18, fontWeight: 'bold', paddingVertical: 16, paddingHorizontal: 10 }}
      >
        Bạn nhận thông báo qua
      </Text>
      {listMethodPushNotifications.map((item, i) => (
        <FunctionItem
          key={i}
          title={item.title}
          subtitle={item.subtitle}
          leftIconName={item.iconName}
          sizeLeftIcon={24}
          isDivider={i !== methodLastIndex}
          onPress={item?.onPress}
        />
      ))}
    </ScrollView>
  );
}

export default SettingNotification;

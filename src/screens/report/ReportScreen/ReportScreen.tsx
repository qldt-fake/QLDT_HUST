import { Alert, View } from 'react-native';
import { Button, Text, Divider, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ReportNavigationName } from 'src/common/constants/nameScreen';
import { color } from 'src/common/constants/color';
import { useState } from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import BaseButton from 'src/components/BaseButton';
import { IReportPost, reportPostApi } from 'src/services/post.sevices';
import { useAppDispatch } from 'src/redux';
import { setMessage } from 'src/redux/slices/appSlice';
import { handShowErrorMessage } from 'src/utils/helper';
import { setBlockApi } from 'src/services/block.service';
import { blockComponent } from 'src/redux/slices/blockSlice';

const ReportScreen = () => {
  const route: RouteProp<ReportNavigationType, ReportNavigationName.ReportScreen> = useRoute();
  const id = route.params?.id;
  const username = route.params?.username;
  const userId = route.params?.userId;

  const options = [
    'Ảnh khỏa thân',
    'Bạo lực',
    'Quấy rối',
    'Tự tử/ gây thương tích',
    'Tin giả',
    'Spam',
    'Bán hàng trái phép',
    'Ngôn từ gây thù ghét',
    'Khủng bố',
    'Vấn đề khác'
  ];
  const select: boolean[] = new Array(options.length).fill(false);
  const [selected, setSelected] = useState(select);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const onPressNext = async () => {
    try {
      const opt = options.filter((_, index) => selected[index]);
      const subject = 'Báo cáo bài viết';
      const data: IReportPost = {
        id: id,
        subject,
        details: opt.join(', ')
      };
      const result = await reportPostApi(data);
      if (result.success) {
        navigation.goBack();
        dispatch(setMessage('Báo cách bài viết thành công'));
      } else {
        dispatch(setMessage(handShowErrorMessage(parseInt(result.code as unknown as string))));
      }
    } catch (error) {
      dispatch(setMessage('Vui lòng kiểm tra lại kết nối internet!'));
    }
  };
  const handleBlockUser = async () => {
    Alert.alert(
      `Chặn trang cá nhân của ${username}`,
      `Những người bạn chặn sẽ không thể bắt đầu trò chuyện, thêm bạn vào danh sách bạn bè hoặc xem nội dung của bạn đăng trên dòng thời gian của mình nữa. Nếu bạn chặn ai đó khi hai người đang là bạn bè thì hành động này cũng sẽ hủy kết bạn với họ.`,
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Chặn',
          onPress: async () => {
            try {
              await setBlockApi({ user_id: userId });
              dispatch(blockComponent());
              Alert.alert(
                `Thành công`,
                `Bạn đã chặn ${username}.\n${username} sẽ không nhận được thông báo về hành động này.`
              );
            } catch (error) {
              return;
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: color.white, padding: 5, paddingVertical: 10 }}
    >
      <View style={{ paddingHorizontal: 5 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          Vui lòng chọn vấn đề để tiếp tục
        </Text>
        <Text
          style={{
            fontSize: 14
          }}
        >
          Bạn có thể báo cáo vài viết sau khi chọn vấn đề.
        </Text>
      </View>
      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, rowGap: 5, paddingVertical: 10 }}
      >
        {options.map((option, index) => (
          <Button
            key={index}
            textColor={selected[index] ? color.white : color.textColor}
            mode={selected[index] ? 'contained' : 'outlined'}
            onPress={() =>
              setSelected(prev => [...prev.slice(0, index), !prev[index], ...prev.slice(index + 1)])
            }
          >
            {option}
          </Button>
        ))}
      </View>

      <Divider bold />
      <Text
        style={{
          fontSize: 18,
          paddingVertical: 10,
          fontWeight: 'bold',
          paddingHorizontal: 5
        }}
      >
        Các bước khác mà bạn có thể thực hiện
      </Text>
      <TouchableRipple onPress={handleBlockUser}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            gap: 10,
            paddingLeft: 20
          }}
        >
          <MaterialCommunityIcon name='block-helper' size={25} color={color.textColor} />
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Chặn {username}</Text>
            <Text style={{ fontSize: 12 }}>
              Các bạn sẽ không thể nhìn thấy hoặc liên hệ với nhau
            </Text>
          </View>
        </View>
      </TouchableRipple>
      <TouchableRipple>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            gap: 10,
            paddingLeft: 20
          }}
        >
          <SimpleLineIcon name='user-unfollow' size={25} color={color.textColor} />
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Bỏ theo dõi {username}</Text>
            <Text style={{ fontSize: 12 }}>Dừng xem bài viết nhưng vẫn là bạn bè</Text>
          </View>
        </View>
      </TouchableRipple>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 10,
          paddingVertical: 20,
          paddingHorizontal: 10,
          gap: 10,
          borderColor: color.borderColor,
          borderWidth: 1,
          borderRadius: 10
        }}
      >
        <Ionicon name='information-circle-sharp' size={25} color={color.borderColor} />
        <Text style={{ fontSize: 16, paddingRight: 40 }}>
          Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy báo cáo ngay cho dịch vụ
          cấp cứu tại địa phương.
        </Text>
      </View>
      <BaseButton
        disabled={!selected.includes(true)}
        mode='contained'
        style={{ marginVertical: 10, marginHorizontal: 5 }}
        onPress={onPressNext}
      >
        Tiếp
      </BaseButton>
    </SafeAreaView>
  );
};

export default ReportScreen;

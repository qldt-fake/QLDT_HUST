import { useState } from 'react';
import { Alert, TouchableOpacity, Image } from 'react-native';
import { ActivityIndicator, Card, CardTitleProps, Text, TouchableRipple } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import { useAppDispatch } from 'src/redux';
import { blockComponent } from 'src/redux/slices/blockSlice';
import { setBlockApi, unBlockApi } from 'src/services/block.service';
import { getAvatarUri } from 'src/utils/helper';
export type BlockFirendItemProps = CardTitleProps & {
  avatar?: string;
  id: string;
  onPress?: () => void;
};
function BlockFriendItem(props: BlockFirendItemProps) {
  const dispatch = useAppDispatch();
  const { title, avatar, onPress, id, ...remainProps } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNonBlock, setIsNonBlock] = useState<boolean>(false);
  const onPressNonBlock = async () => {
    Alert.alert('XÁC NHẬN', `Bạn có chắc chắn bỏ chặn ${title} hay không?`, [
      {
        text: 'Hủy',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Đồng ý',
        onPress: async () => {
          try {
            setIsLoading(true);
            const res = await unBlockApi({ user_id: id });
            if (res.success) {
              setIsNonBlock(true);
            }
          } catch (error) {
            return;
          } finally {
            setIsLoading(false);
          }
        }
      }
    ]);
  };
  const onPressBlock = () => {
    Alert.alert(
      'XÁC NHẬN',
      `Bạn có chắc chắn chặn ${title} hay không?. Nếu có mọi thông tin về bạn sẽ ẩn với ${title}`,
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
              setIsLoading(true);
              const res = await setBlockApi({ user_id: id });
              dispatch(blockComponent());
              if (res.success) {
                setIsNonBlock(false);
              }
            } catch (error) {
              return;
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  return (
    <TouchableRipple underlayColor={color.borderColor} onPress={onPress ?? (() => {})}>
      <Card.Title
        {...remainProps}
        title={title}
        left={() => (
          <Image
            source={getAvatarUri(avatar as string)}
            style={{ width: 45, height: 45, borderRadius: 2 }}
            blurRadius={isNonBlock ? 0 : 6}
            resizeMode='cover'
          />
        )}
        right={() =>
          isLoading ? (
            <ActivityIndicator color={color.activeOutlineColor} style={{ marginRight: 20 }} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={isNonBlock ? onPressBlock : onPressNonBlock}
            >
              <Text
                style={{
                  paddingHorizontal: 20,
                  fontWeight: '600',
                  fontSize: 16,
                  color: color.activeOutlineColor
                }}
              >
                {isNonBlock ? 'Chặn' : 'Bỏ chặn'}
              </Text>
            </TouchableOpacity>
          )
        }
      />
    </TouchableRipple>
  );
}

export default BlockFriendItem;

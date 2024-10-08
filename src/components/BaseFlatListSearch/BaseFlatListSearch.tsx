import { ForwardedRef, forwardRef } from 'react';
import { FlatListProps, FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { color } from 'src/common/constants/color';

const ITEM_HEIGHT = 10;

export type BaseFlatListProps = FlatListProps<any> & { isFootterLoading?: boolean };
function BaseFlatListSearch(props: BaseFlatListProps, ref: ForwardedRef<FlatList>) {
  const { onRefresh, refreshing, isFootterLoading, ListEmptyComponent, ...propsRemain } = props;
  return (
    <FlatList
      ref={ref}
      {...propsRemain}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
      })}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh as any}
          refreshing={refreshing as boolean}
          colors={[color.primary]}
        />
      }
      ListEmptyComponent={
        ListEmptyComponent ?? (
          <View
            style={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <IconButton icon='magnify' size={50} iconColor={color.activeOutlineColor} />
            <Text
              variant='bodyLarge'
              style={{
                textAlign: 'center',
                padding: 30
              }}
            >
              Rất tiếc, chúng tôi không tìm thất kết quả nào phù hợp
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        isFootterLoading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator color={color.outlineColor} />
          </View>
        ) : null
      }
    />
  );
}

export default forwardRef(BaseFlatListSearch);

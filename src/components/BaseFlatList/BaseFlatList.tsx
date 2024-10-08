import { ForwardedRef, forwardRef } from 'react';
import { FlatListProps, FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { color } from 'src/common/constants/color';

const ITEM_HEIGHT = 10;

export type BaseFlatListProps = FlatListProps<any> & { isFootterLoading?: boolean };
function BaseFlatList(props: BaseFlatListProps, ref: ForwardedRef<FlatList>) {
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
          <Text variant='bodyLarge' style={{ textAlign: 'center', marginTop: 20 }}>
            Danh sách trống
          </Text>
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

export default forwardRef(BaseFlatList);

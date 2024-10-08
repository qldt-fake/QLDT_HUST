import { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
export interface ListItemCardProps {
  title: string;
  left: ReactNode;
  onPress?: () => any;
}
function ListItemCard(props: ListItemCardProps) {
  const { title, left, onPress } = props;
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card
        style={{
          marginHorizontal: 16,
          marginBottom: 12,
          paddingVertical: 16,
          paddingHorizontal: 10
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
          {left}
          <Text variant='titleMedium'>{title}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default ListItemCard;

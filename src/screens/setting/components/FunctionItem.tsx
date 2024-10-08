import { ReactNode } from 'react';
import { Card, CardTitleProps, Divider, IconButton, TouchableRipple } from 'react-native-paper';
import { color } from 'src/common/constants/color';
type FuctionItemProps = CardTitleProps & {
  onPress?: () => any;
  rightIcon?: boolean;
  leftIconName?: string;
  sizeLeftIcon?: number;
  isDivider?: boolean;
  customRightIcon?: ReactNode;
};
function FunctionItem(props: FuctionItemProps) {
  const {
    title,
    subtitle,
    onPress,
    rightIcon,
    leftIconName,
    sizeLeftIcon,
    isDivider,
    customRightIcon,
    ...remainProps
  } = props;
  return (
    <>
      <TouchableRipple underlayColor={color.borderColor} onPress={onPress ?? (() => {})}>
        <Card.Title
          {...remainProps}
          title={title}
          subtitle={subtitle}
          titleVariant='titleMedium'
          subtitleVariant='bodySmall'
          subtitleStyle={{ color: color.activeOutlineColor }}
          subtitleNumberOfLines={3}
          titleNumberOfLines={3}
          right={props =>
            rightIcon ? (
              customRightIcon ? (
                customRightIcon
              ) : (
                <IconButton {...props} icon='chevron-right' iconColor={color.activeOutlineColor} />
              )
            ) : null
          }
          left={props =>
            leftIconName ? (
              <IconButton {...props} icon={leftIconName as string} size={sizeLeftIcon ?? 30} />
            ) : null
          }
        />
      </TouchableRipple>
      {isDivider ? <Divider /> : null}
    </>
  );
}

export default FunctionItem;

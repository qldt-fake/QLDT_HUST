import { Text, TextProps } from 'react-native-paper';
export type TextTitleProps = TextProps<any>;
function TextTitle(props: TextTitleProps) {
  const { children } = props;
  return (
    <Text variant='titleMedium' style={{ fontSize: 16, fontWeight: 'bold' }}>
      {children}
    </Text>
  );
}

export default TextTitle;

import { useState } from 'react';
import { ImageProps, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { color } from 'src/common/constants/color';

export type BaseImageProps = ImageProps;
function BaseImage(props: BaseImageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onLoadStart, onLoadEnd, style, ...remainProps } = props;
  const handleStartLoading = () => {
    setIsLoading(true);
    (onLoadStart ?? (() => {}))();
  };
  const handleEndLoading = () => {
    setIsLoading(false);
    (onLoadEnd ?? (() => {}))();
  };
  return (
    <>
      <ActivityIndicator
        style={[style, { display: isLoading ? 'flex' : 'none' }]}
        color={color.activeOutlineColor}
      />
      <Image
        {...remainProps}
        style={[style, { display: isLoading ? 'none' : 'flex' }]}
        onLoadStart={handleStartLoading}
        onLoadEnd={handleEndLoading}
      />
    </>
  );
}

export default BaseImage;

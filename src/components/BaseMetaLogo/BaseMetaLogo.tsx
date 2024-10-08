import { PropsWithChildren, FC } from 'react';
import { ImageProps } from 'react-native';
import styled from 'styled-components/native';
interface BaseImageProps {
  width?: number;
  height?: number;
}
export type BaseMetaLogoProps = BaseImageProps & Partial<ImageProps>;
const defaultProps: BaseImageProps = {
  width: 50,
  height: 30
};
function BaseMetaLogo(props: BaseMetaLogoProps) {
  return <ImageLogo {...props} source={require('src/assets/meta-logo.png')} />;
}
BaseMetaLogo.defaultProps = defaultProps;
const ImageLogo: FC<PropsWithChildren<BaseMetaLogoProps>> = styled.Image`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  object-fit: contain;
  align-self: center;
`;

export default BaseMetaLogo;

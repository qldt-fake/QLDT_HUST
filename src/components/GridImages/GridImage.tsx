import { StyleSheet, View } from 'react-native';
import ImageItem from './components/ImageItem';
import RenderImages from './components/RenderImages';
export interface IGridImageProps {
  images: string[];
  style?: any;
  onPress: () => void;
  isShowCloseIcon?: boolean;
  onPressCloseIcon?: () => any;
}
function GridImage({ images, style, onPress, isShowCloseIcon, onPressCloseIcon }: IGridImageProps) {
  const length = images.length;
  return length > 0 && images ? (
    <View style={[styles.container_row, style]}>
      {length < 5 ? (
        length < 3 ? (
          <>
            <ImageItem
              image={images[0]}
              onPress={onPress}
              index={0}
              isShowCloseIcon={isShowCloseIcon && length < 2}
              onPressCloseIcon={onPressCloseIcon}
            />
            <ImageItem image={images[1]} onPress={onPress} index={1} />
          </>
        ) : (
          <>
            <ImageItem image={images[0]} onPress={onPress} index={0} />
            <View style={styles.container}>
              <RenderImages start={1} overflow={false} images={images} onPress={onPress} />
            </View>
          </>
        )
      ) : (
        <>
          <View style={styles.container}>
            <ImageItem image={images[0]} onPress={onPress} index={0} />
            <ImageItem image={images[1]} onPress={onPress} index={1} />
          </View>
          <View style={styles.container}>
            <RenderImages start={2} overflow={length > 5} images={images} onPress={onPress} />
          </View>
        </>
      )}
    </View>
  ) : null;
}
const styles = StyleSheet.create({
  container_row: {
    flexDirection: 'row'
  },

  container: {
    flex: 1
  }
});
export default GridImage;

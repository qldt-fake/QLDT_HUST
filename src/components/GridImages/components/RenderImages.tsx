import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import ImageItem from './ImageItem';
export interface IRenderImagesProps {
  start: number;
  overflow: boolean;
  images: string[];
  onPress: () => any;
}
function RenderImages({ start, images, overflow, onPress }: IRenderImagesProps) {
  return (
    <>
      <ImageItem image={images[start]} onPress={onPress} index={start} />
      {images[start + 1] && (
        <View style={styles.image_view}>
          <ImageItem image={images[start + 1]} onPress={onPress} index={start + 1} />
        </View>
      )}
      {images[start + 2] && (
        <View style={styles.image_view}>
          <ImageItem image={images[start + 2]} onPress={onPress} index={start + 2} />
          {overflow && (
            <TouchableOpacity
              onPress={onPress}
              style={styles.item_view_overlay}
              activeOpacity={0.8}
            >
              <Text style={styles.text}>{`+${images.length - 5}`}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  image_view: {
    flex: 1,
    margin: 1
  },
  item_view_overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  text: {
    color: 'white',
    fontSize: 18
  }
});
export default RenderImages;

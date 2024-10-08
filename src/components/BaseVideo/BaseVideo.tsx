import VideoPlayer, { VideoPlayerProps } from 'react-native-video-player';
export type BaseVideoProps = VideoPlayerProps;
const defaultProps: Partial<BaseVideoProps> = {
  videoHeight: 900,
  videoWidth: 1600,
  autoplay: false,
  showDuration: true,
  defaultMuted: true,
  disableFullscreen: false,
  pauseOnPress: true,
  resizeMode: 'contain'
};
function BaseVideo(props: VideoPlayerProps) {
  const { video, ...propsRemain } = props;
  return video ? (
    <VideoPlayer
      {...propsRemain}
      video={video}
      thumbnail={require('src/assets/cover-default.jpg')}
    />
  ) : null;
}
BaseVideo.defaultProps = defaultProps;
export default BaseVideo;

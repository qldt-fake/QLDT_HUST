import { StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';
const styles = StyleSheet.create({
  searchheader: {
    height: 34,
    zIndex: 1
    // marginTop: 0,

    // width: 360,
  },
  searchInput: {
    height: 34,
    zIndex: 0,
    width: 240,
    // paddingLeft: 12,
    // paddingRight:12,
    border: 'none',
    borderRadius: 50

    // marginLeft:0,
  },

  container: {
    justifyContent: 'flex-start',
    margin: 0,
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  containerListComment: {
    justifyContent: 'flex-start',
    margin: 0,
    // marginTop: 40,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  icon: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center'
  },
  numbericon: {
    fontWeight: '700',
    color: '#000',
    fontSize: 14
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 43
    // paddingTop: 20
  },
  like: {
    // width:18,
    // height:10
    position: 'relative'
  },
  heart: {
    position: 'relative'
  },
  laugh: {
    position: 'relative'
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: color.textColor
  },
  bio: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
    marginBottom: 20
  },
  section: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  nearlyall: {
    marginTop: 10
  },

  nearly: {
    marginLeft: 20,
    color: '#050505',
    fontWeight: '700',
    fontSize: 16
  },

  seeall: {
    fontSize: 16,
    marginRight: 20,
    color: '#0064d1'
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  coverPhoto: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  avatarWrapper: {
    display: 'flex',
    position: 'absolute',
    top: 150,
    borderRadius: 105,
    borderWidth: 5,
    borderColor: 'white',
    overflow: 'hidden'
  },
  infomation: {
    marginTop: 40
  },
  cameraIconWrapper: {
    position: 'absolute',
    top: 200,
    right: 0
  },
  cameraIcon: {
    padding: 10
  },
  cameraIconAvatar: {
    position: 'relative',
    top: 40,
    left: 70
  },
  closeButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black'
  },
  detailsContainer: {
    marginTop: 20,
    marginLeft: 20
  },
  detailLabel: {
    fontSize: 18,
    marginRight: 5,
    marginLeft: 10
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.textColor
  },
  editPublicButton: {
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: '#E9F1FE',
    padding: 10,
    borderRadius: 7
  },
  editPublicButtonText: {
    color: color.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  option: {
    paddingVertical: 0
  },

  touchableHighlight: {
    borderRadius: 50, // Đảm bảo các góc của TouchableHighlight phù hợp với hình ảnh
    overflow: 'hidden', // Để các phần không phù hợp với hình ảnh bị ẩn đi
    // width: 40,
    height: 40,
    // marginTop:8,
    marginLeft: 8
    // zIndex:10
  },

  avatarImage: {
    opacity: 0.8
  },

  CommentItem: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 14,
    gap: 6
  },
  top: {
    position: 'relative',
    flexDirection: 'row',
    gap: 10
  },
  Content: {
    flexDirection: 'column',
    display: 'flex',
    // alignItems:'center',
    gap: 2,
    justifyContent: 'center',
    backgroundColor: color.Comment,
    borderRadius: 14,
    paddingRight: 20,
    paddingBottom: 2,
    maxWidth: 290
  },
  ContentNameFeel: {
    flexDirection: 'column',
    display: 'flex',
    // alignItems:'center',
    gap: 2,
    justifyContent: 'center',
    // backgroundColor: color.white,
    borderRadius: 14,
    paddingRight: 20,
    paddingBottom: 2,
    maxWidth: 290
  },
  TextName: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 10,
    // height: 21,
    color: color.black,
    paddingRight: 2,
    paddingLeft: 2,
    fontWeight: 'bold'
  },
  TextNameFeel: {
    fontSize: 15,
    marginTop: 2,
    marginLeft: 10,
    // height: 21,
    color: color.black,
    paddingRight: 2,
    paddingLeft: 2,
    fontWeight: 'bold'
  },
  TextCommment: {
    marginLeft: 10,
    marginBottom: 2,
    color: color.black
  },
  TextTime: {
    color: color.textLike,
    fontSize: 12
  },
  TextLike: {
    color: color.textLike,
    fontWeight: '700',
    fontSize: 12
  },
  TextTrust: {
    color: color.likeIcon,
    fontWeight: '700',
    fontSize: 12
  },

  TextFake: {
    color: color.error,
    fontWeight: '700',
    fontSize: 12
  },
  highlightText: {
    height: 20,
    width: 45,
    borderRadius: 4
  },
  highlightConment: {
    height: 20,
    width: 65,
    borderRadius: 4
  },
  TextResponse: {
    color: color.textLike,
    fontWeight: '700',
    fontSize: 12
  },
  Function: {
    flexDirection: 'row',
    marginLeft: 68,
    gap: 10
  },
  viewBeForeComment: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4
  },
  topRep: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 50,
    alignItems: 'center'
  },
  ContentRep: {
    flexDirection: 'column',
    display: 'flex',
    // alignItems:'center',
    gap: 2,
    justifyContent: 'center',
    backgroundColor: color.Comment,
    borderRadius: 14,
    paddingRight: 20,
    paddingBottom: 2,
    maxWidth: 290
  },
  TextNameRep: {
    fontSize: 12,
    paddingTop: 2,
    marginLeft: 10,
    // height: 21,
    color: color.black,
    paddingRight: 2,
    paddingLeft: 2,
    fontWeight: 'bold'
  },
  TextCommmentRep: {
    marginLeft: 10,
    marginBottom: 2,
    color: color.black
    // lineHeight: 20
    // maxHeight:340
  },
  FunctionRep: {
    flexDirection: 'row',
    marginLeft: 100,
    gap: 10
  },
  left: {
    display: 'flex',
    flexDirection: 'row'
    // gap:0
  },
  listIcon: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5
  },
  listIcon0: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 90
  },
  listIcon1: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 150
  },
  likeIcon: {
    padding: 3,
    paddingLeft: 4,
    borderWidth: 1, // Border width
    borderColor: color.white, // Border color
    borderRadius: 50,
    backgroundColor: '#3578E5',
    color: color.white
  },
  likeIconFeel: {
    padding: 3,
    paddingLeft: 4,
    borderWidth: 1, // Border width
    borderColor: color.white, // Border color
    borderRadius: 50,
    backgroundColor: '#3578E5',
    color: color.white,
    zIndex: 1
  },
  dislikeIconFeel: {
    padding: 3,
    paddingLeft: 4,
    borderWidth: 1, // Border width
    borderColor: color.white, // Border color
    borderRadius: 50,
    backgroundColor: color.Comment,
    color: color.black,
    zIndex: 1
  },
  dislikeIcon: {
    padding: 3,
    paddingLeft: 4,
    borderWidth: 1, // Border width
    borderColor: color.white, // Border color
    borderRadius: 50,
    backgroundColor: color.Comment,
    color: color.black
  },
  heartIcon: {
    position: 'relative',
    zIndex: 1,
    right: 5
  },
  laughtIcon: {
    position: 'relative',
    right: 10
  },
  rightIcon: {
    // color: '#3578E5'
  },
  headerListFeel: {
    paddingLeft: 0,
    height: 43,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  ListFeel: {
    paddingLeft: 20,
    height: 43,
    gap: 30,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textHeaderListFeel: {
    fontSize: 20,
    color: color.black
  },
  modalLike: {
    width: 40,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    top: -50,
    left: 0,
    backgroundColor: color.white,
    padding: 5,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: 'var(--media-inner-border)',
    shadowColor: 'var(--shadow-1)',
    elevation: 2
  }
});
export default styles;

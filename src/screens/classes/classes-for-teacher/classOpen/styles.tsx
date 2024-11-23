import { StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#EFEFEF", // Màu nền chính là color.primary
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#ddd',
    height: 1,
  },
  span: {
    color: color.primary, // Sử dụng màu chủ đạo cho các phần span
  },
  // Classes Card
  classesCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f7f7f7', // Màu nền sáng sủa hơn
    elevation: 5,
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd', // Màu nền nổi bật hơn cho header
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  columnHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerName: {
    flex: 0.5,
  },
  headerType: {
    flex: 1.5,
  },
  headerStatus: {
    flex: 0.8,
  },
  class_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff', // Màu nền trắng cho các phần thông tin lớp học
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1976d2', // Màu nền của icon
    borderRadius: 15,
    padding: 4,
    elevation: 3,
  },
});

export default styles;

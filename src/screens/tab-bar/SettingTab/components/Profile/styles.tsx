import { StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: color.second,
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#777',
    marginVertical: 2,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  column: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#ddd',
  },
  span: {
    color: color.black, // Custom color for "span" text, like a link color
  },
});

export default styles;

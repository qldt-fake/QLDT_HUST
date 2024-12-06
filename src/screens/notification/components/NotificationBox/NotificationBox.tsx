import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface NotificationProps {
  title: string;
  content: string;
  date: string;
  read: boolean;
}
function formatTimeDifference(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;

  if (diffInSeconds < secondsInMinute) {
    return `${diffInSeconds} giây trước`;
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} giờ trước`;
  } else {
    return date.toLocaleDateString('vi-VN');
  }
}
const NotificationBox: React.FC<NotificationProps> = ({ title, content, date, read }) => {
  return (
    <View style={[styles.boxContainer, read ? styles.readCard : styles.unreadCard]}>
      <View style={styles.headerContainer}>
        <Text style={styles.QLDTText}>QLDT</Text>
        <Text style={styles.dateText}>{formatTimeDifference(date)}</Text>
      </View>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.divider} />
      <Text style={styles.contentText}>{content.split("\n")[0]}</Text>
      <Text style={styles.detailsText}>Chi tiết</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 8,
    marginHorizontal: 16
  },
  unreadCard: {
    backgroundColor: '#ece9e9'
  },
  readCard: {
    backgroundColor: '#ffffff'
  },
  QLDTText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  dateText: {
    color: '#6c6868',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'right'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  contentText: {
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'monospace'
  },
  detailsText: {
    alignSelf: 'flex-end',
    color: '#007bff',
    fontSize: 16
  }
});

export default NotificationBox;

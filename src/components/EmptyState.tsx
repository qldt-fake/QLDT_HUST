import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';
interface EmptyStateProps {
  title: string;
  imageSource?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, imageSource }) => {

  return (
    <View style={styles.container}>
      <Image source={require('../assets/emptyState.png')} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    color: color.primary,
    textAlign: 'center',
    lineHeight: 28
  }
});

export default EmptyState;
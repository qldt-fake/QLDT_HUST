import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface ClassHeaderProps {
  title?: string;
  textLogo?: string;
}

const defaultProps = {
  textLogo: "HUST"
}

const ClassHeader = (props: ClassHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <Icon name='long-arrow-left' size={20} color='#fff' />
        <Text style={styles.logo}>{props?.textLogo}</Text>
      </View>
      {!!props?.title && <Text style={styles.title}>{props?.title}</Text>}
    </View>
  );
};

ClassHeader.defaultProps = defaultProps

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#b30000',
    paddingHorizontal: 30,
    rowGap: 5
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    borderRadius: 5,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    flex: 1,
    textAlign: 'center',
    marginLeft: -20
  },
  title: {
    fontSize: 20,
    color: 'white'
  }
});

export default ClassHeader;

// src/components/common/GlobalWebView.tsx
import React from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { color } from 'src/common/constants/color';
import { useNavigation } from '@react-navigation/native';

interface GlobalWebViewProps {
  url: string;
  title?: string;
  onClose?: () => void;
}

const GlobalWebView: React.FC<any> = ({route} : any) => {
  const navigation = useNavigation()
  const {url, title , onClose} = route?.params as GlobalWebViewProps;
  console.log({ url, title });

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color={color.primary} size="large" />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },
  webview: {
    flex: 1
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.white
  }
});

export default GlobalWebView;
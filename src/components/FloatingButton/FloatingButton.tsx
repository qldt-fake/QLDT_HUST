import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';

interface FloatingButtonProps {
  actions: { icon: string; text: string; onPress: () => void }[];
  position?: { bottom?: number; right?: number; left?: number; top?: number };
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ actions, position }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.container, position]}>
      {isExpanded && (
        <View style={styles.expandedButtons}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.expandedButton}
              onPress={() => {
                action.onPress();
                setIsExpanded(false);
              }}
            >
              <Text numberOfLines={1} style={styles.buttonText}>
                {action.text}
              </Text>
              <Icon name={action.icon} size={24} color={color.red} />
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={toggleExpand}>
        <Icon name={isExpanded ? 'times' : 'plus'} size={20} color={color.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'flex-end',
    zIndex: 10
  },
  expandedButtons: {
    marginBottom: 10
  },
  expandedButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonText: {
    fontWeight: 'bold',
    marginRight: 10,
    flexShrink: 1,
    textAlign: 'right'
  },
  floatingButton: {
    backgroundColor: color.red,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50
  }
});

export default FloatingButton;

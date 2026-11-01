import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

const CustomButton = ({title, onPress, variant = 'primary' , disabled = false}) => {
  const isSecondary = variant === 'secondary';

  return (
<Pressable
  style={[
    styles.button,
    isSecondary && styles.secondaryButton,
    disabled && styles.disabledButton,
  ]}
  onPress={onPress}
  disabled={disabled}>
      <Text
        style={[
          styles.text,
          isSecondary && styles.secondaryText,
        ]}>
        {title}
      </Text>

      {!isSecondary && (
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 22,
    backgroundColor: '#6572B8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  arrowContainer: {
    marginLeft: 10,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E1F2',
  },

  secondaryText: {
    color: '#172A50',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CustomButton;
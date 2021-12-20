import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

export default function Input(props) {
  return (
    <TextInput
      style={styles.input}
      placeholder={props.placeholder}
      onChangeText={props.onChangeText}
      secureTextEntry={props.secureTextEntry}
      value={props.value}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
});

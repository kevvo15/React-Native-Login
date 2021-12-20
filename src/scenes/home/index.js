import React from 'react';
import {Button, Text, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function HomeScreen({navigation}) {
  // Signs the user out
  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User successfully signed out.');
        navigation.replace('Login');
      });
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button title="Sign Out" onPress={signOut} />
    </SafeAreaView>
  );
}

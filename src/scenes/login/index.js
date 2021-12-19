import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import ReactNativeBiometrics from 'react-native-biometrics';

export default function LoginScreen({navigation}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const handleLogin = () => {
    ReactNativeBiometrics.isSensorAvailable().then(
      ({available, biometryType, error}) => {
        if (available) {
          switch (biometryType) {
            case ReactNativeBiometrics.TouchID:
            case ReactNativeBiometrics.FaceID:
            case ReactNativeBiometrics.Biometrics:
              ReactNativeBiometrics.simplePrompt({
                promptMessage: 'Verify your identity',
              }).then(({success}) => {
                if (success) {
                  console.log('successful biometrics provided\n');
                  console.log('<<<DEV SIGN IN NOW>>>');
                } else {
                  console.log('user cancelled biometric prompt');
                }
              });
              break;
            default:
              console.error(`Biometrics type not supported: ${biometryType}`);
          }
        } else console.log(error);
      },
    );
  };

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
        <Button
          title="Go to Home"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
        <Button title="Log In" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}

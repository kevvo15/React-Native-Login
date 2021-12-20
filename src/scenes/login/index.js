import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Formik} from 'formik';
import auth from '@react-native-firebase/auth';
import ReactNativeBiometrics from 'react-native-biometrics';

export default function LoginScreen({navigation}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (user) {
      setLoading(false);
      navigation.replace('Home');
      console.log('User signed in successfully!');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading)
    return (
      <View>
        <ActivityIndicator
          size="large"
          color="black"
          style={{flex: 1, justifyContent: 'center'}}
        />
      </View>
    );

  const biometricLogin = () => {
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

  const formLogin = (email, password) => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        setLoading(false);
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Invalid Email Format Submitted');
            break;
          case 'auth/wrong-password':
            Alert.alert('Incorrect Email or Password Submitted');
            break;
          case 'auth/user-not-found':
            Alert.alert('Incorrect Email or Password Submitted');
            break;
        }
      });
  };

  if (!user) {
    return (
      <View>
        <Formik
          initialValues={{email: '', password: ''}}
          // validationSchema={loginSchema}
          onSubmit={(values, {resetForm}) => {
            resetForm({
              values: {
                email: '',
                password: '',
              },
            });
            formLogin(values.email, values.password);
            console.log('Email: ' + values.email + ' PW: ' + values.password);
          }}>
          {formikprops => (
            <>
              <View>
                <TextInput
                  // style={globalStyles.input}
                  placeholder="Email                            "
                  onChangeText={formikprops.handleChange('email')}
                  value={formikprops.values.email}
                />
                <TextInput
                  // style={globalStyles.input}
                  placeholder="Password                         "
                  secureTextEntry={true}
                  onChangeText={formikprops.handleChange('password')}
                  value={formikprops.values.password}
                />
                <Button
                  title="Log In"
                  color="black"
                  onPress={formikprops.handleSubmit}
                />
              </View>
              <View>
                <Text>New User?</Text>
                <Button
                  title="Register Here"
                  color="black"
                  onPress={() => {
                    //navigation.replace('Signup');
                    console.log('Register Button Clicked');
                  }}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Button title="Verify ID to Continue" onPress={biometricLogin} />
    </View>
  );
}

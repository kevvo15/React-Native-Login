import React, {useState, useEffect} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import {Formik} from 'formik';
import auth from '@react-native-firebase/auth';
import {Biometrics} from '_utils';
import {Input, LoadingIndicator} from '_atoms';

export default function LoginScreen({navigation}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (user) {
      setLoading(false);
      navigation.replace('Home');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) return <LoadingIndicator />;

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

  // Signs the user out
  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User successfully signed out.'));
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
                <Input
                  placeholder="Email"
                  secureTextEntry={false}
                  onChangeText={formikprops.handleChange('email')}
                  value={formikprops.values.email}
                />
                <Input
                  placeholder="Password"
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
                    navigation.replace('Register');
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
      <Button title="Reverify It's You to Continue" onPress={Biometrics} />
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

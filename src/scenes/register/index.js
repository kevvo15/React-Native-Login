import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';

export default function RegisterScreen({navigation}) {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <View>
        <ActivityIndicator
          color="black"
          size="large"
          style={{flex: 1, justifyContent: 'center'}}
        />
      </View>
    );
  }

  // Email and Password User Creation
  const createUser = (email, password) => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account successfully created.');
        setLoading(false);
        navigation.replace('Home');
      })
      .catch(error => {
        setLoading(false);
        switch (error.code) {
          case 'auth/email-already-in-use':
            Alert.alert('Email Address is Already in Use');
            break;
          case 'auth/invalid-email':
            Alert.alert('Invalid Email Format Submitted');
            break;
          case 'auth/weak-password':
            Alert.alert('Password Entered is Too Weak!');
        }
      });
  };

  return (
    <View>
      <Text>
        Register today with a valid email address and a strong password!
      </Text>
      <Formik
        initialValues={{email: '', password: '', validate: ''}}
        // validationSchema={registerSchema}
        onSubmit={(values, {resetForm}) => {
          if (values.password === values.validate) {
            createUser(values.email, values.password);
            console.log('Email: ' + values.email + ' PW: ' + values.password);
            resetForm({
              values: {
                email: '',
                password: '',
                validate: '',
              },
            });
          } else {
            resetForm({
              values: {
                email: '',
                password: '',
                validate: '',
              },
            });
            Alert.alert('Passwords Must Match');
          }
        }}>
        {formikprops => (
          <>
            <View>
              <TextInput
                //style={globalStyles.input}
                placeholder="Email                            "
                onChangeText={formikprops.handleChange('email')}
                value={formikprops.values.email}
              />
              <TextInput
                //style={globalStyles.input}
                placeholder="Password                         "
                secureTextEntry={true}
                onChangeText={formikprops.handleChange('password')}
                value={formikprops.values.password}
              />
              <TextInput
                //style={globalStyles.input}
                placeholder="Reenter Password                 "
                secureTextEntry={true}
                onChangeText={formikprops.handleChange('validate')}
                value={formikprops.values.validate}
              />
            </View>
            <View>
              <Text>Create Account</Text>
              <Button
                title="Submit"
                color="black"
                onPress={formikprops.handleSubmit}
              />
            </View>
          </>
        )}
      </Formik>
      <View>
        <Text>Go Back To</Text>
        <Button
          title="Login"
          color="black"
          onPress={() => {
            navigation.replace('Login');
          }}
        />
      </View>
    </View>
  );
}

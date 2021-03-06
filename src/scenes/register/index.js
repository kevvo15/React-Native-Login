import React, {useState} from 'react';
import {Alert, Button, SafeAreaView, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import {Input, LoadingIndicator} from '_atoms';
import {Styles} from '_styles';

export default function RegisterScreen({navigation}) {
  const [loading, setLoading] = useState(false);

  if (loading) return <LoadingIndicator />;

  // Email and Password User Creation
  const createUser = (email, password) => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('New User Account successfully created.');
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
    <SafeAreaView style={Styles.container}>
      <Text style={{textAlign: 'center', padding: 40}}>
        Register today to start earning points!
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
              <Input
                placeholder="Reenter Password             "
                secureTextEntry={true}
                onChangeText={formikprops.handleChange('validate')}
                value={formikprops.values.validate}
              />
            </View>
            <View>
              <Text style={{paddingTop: 50}}>Create Account</Text>
              <Button
                title="Submit"
                color="black"
                onPress={formikprops.handleSubmit}
              />
            </View>
          </>
        )}
      </Formik>
      <View style={Styles.container}>
        <Text>Go Back To</Text>
        <Button
          title="Login"
          color="black"
          onPress={() => {
            navigation.replace('Login');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

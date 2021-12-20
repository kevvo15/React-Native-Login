import ReactNativeBiometrics from 'react-native-biometrics';

export default function biometricLogin() {
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
                console.log('User signed in successfully!');
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
}

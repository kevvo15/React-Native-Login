import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';
import * as Mixins from './mixins';
import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingTop: 50,
  },
});

export {Typography, Spacing, Colors, Mixins, Styles};

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.config.js';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';

analytics().setAnalyticsCollectionEnabled(true);

// Background & Quit
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background & Quit', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

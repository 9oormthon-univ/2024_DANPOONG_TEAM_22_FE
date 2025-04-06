import { AppRegistry } from 'react-native';
import Config from 'react-native-config';

import * as amplitude from '@amplitude/analytics-react-native';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';

import { App } from './App';
import { name as appName } from './app.config.js';

analytics().setAnalyticsCollectionEnabled(true);

amplitude.init(Config.AMPLITUDE_API_KEY);

// Background & Quit
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background & Quit', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppInner from 'AppInner';
import {RootStackParamList} from '@type/RootStackParamList';
import {configurePushNotifications} from '@utils/notificationHandler';
import messaging from '@react-native-firebase/messaging';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
    },
  },
});

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

configurePushNotifications(navigationRef);

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer ref={navigationRef}>
          <AppInner />
        </NavigationContainer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;

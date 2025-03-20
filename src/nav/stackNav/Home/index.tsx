import { HomeScreen } from '@screens/RCD/Home';
import { RCDFeedBackScreen } from '@screens/RCD/RCDFeedBack';
import { RCDListScreen } from '@screens/RCD/RCDList';
import { RCDNoticeScreen } from '@screens/RCD/RCDNotice';
import { RCDRecordScreen } from '@screens/RCD/RCDRecord';
import { RCDTextScreen } from '@screens/RCD/RCDText';
import { RCDSelectTextScreen } from '@screens/RCD/RCDSelectText';
import { RCDErrorScreen } from '@screens/RCD/RCDError';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {
  getFocusedRouteNameFromRoute,
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {TabNavOptions} from '@constants/TabNavOptions';
import {useLayoutEffect} from 'react';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNav = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const route = useRoute();

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    
    // Home 스크린일 때만 탭바 표시, 다른 스크린에서는 숨김
    if (!routeName || routeName === 'Home') {
      navigation.setOptions({
        tabBarStyle: TabNavOptions.tabBarStyle
      });
    } else {
      navigation.setOptions({
        tabBarStyle: { display: 'none' }
      });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="RCDList" component={RCDListScreen} />
      <Stack.Screen name="RCDFeedBack" component={RCDFeedBackScreen} />
      <Stack.Screen name="RCDNotice" component={RCDNoticeScreen} />
      <Stack.Screen name="RCDRecord" component={RCDRecordScreen} />
      <Stack.Screen name="RCDText" component={RCDTextScreen} />
      <Stack.Screen name="RCDSelectText" component={RCDSelectTextScreen} />
      <Stack.Screen name="RCDError" component={RCDErrorScreen} />
    </Stack.Navigator>
  );
};

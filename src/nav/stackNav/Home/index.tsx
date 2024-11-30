import HomeScreen from '@screens/Home';
import RCDFeedBackScreen from '@screens/RCD/RCDFeedBack';
import RCDListScreen from '@screens/RCD/RCDList';
import RCDNoticeScreen from '@screens/RCD/RCDNotice';
import RCDRecordScreen from '@screens/RCD/RCDRecord';
import RCDTextScreen from '@screens/RCD/RCDText';
import RCDSelectTextScreen from '@screens/RCD/RCDSelectText';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@type/HomeStackParamList';
import {
  getFocusedRouteNameFromRoute,
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {TabNavOptions} from '@constants/TabNavOptions';
import {useLayoutEffect} from 'react';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNav = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const route = useRoute();

  useLayoutEffect(() => {
    //visual flicker 방지
    const routeName = getFocusedRouteNameFromRoute(route);
    // console.log(route,routeName)
    if (routeName === undefined || routeName === 'Home') {
      //Main이외의 화면에 대해 tabBar none을 설정한다.
      navigation.setOptions(TabNavOptions);
    } else {
      navigation.setOptions({...TabNavOptions, tabBarStyle: {display: 'none'}});
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
    </Stack.Navigator>
  );
};

export default HomeStackNav;

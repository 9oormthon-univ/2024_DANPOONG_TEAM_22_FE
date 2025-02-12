import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SystemStackParamList} from '@type/nav/SystemStackParamList';
import SystemScreen from '@screens/System';
import ModifyInfoScreen from '@screens/System/ModifyInfo';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { TabNavOptions } from '@constants/TabNavOptions';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
const Stack = createNativeStackNavigator<SystemStackParamList>();

const SystemStackNav = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const route = useRoute();
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    
    // System 스크린일 때만 탭바 표시, 다른 스크린에서는 숨김
    if (!routeName || routeName === 'System') {
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
      <Stack.Screen name="System" component={SystemScreen} />
      <Stack.Screen name="ModifyInfo" component={ModifyInfoScreen} />

    </Stack.Navigator>
  );
};

export default SystemStackNav;

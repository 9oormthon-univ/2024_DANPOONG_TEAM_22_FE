import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SystemStackParamList} from '@type/nav/SystemStackParamList';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { TabNavOptions } from '@constants/TabNavOptions';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
// Screens
import { SystemScreen } from '@screens/System';
import { ModifyInfoScreen } from '@screens/System/ModifyInfo';
import { MyAccountScreen } from '@screens/System/MyAccount';
import { NotificationSettingScreen } from '@screens/System/NotificationSetting';
import { ServiceScreen } from '@screens/System/Service';
import { ConnectedAccountScreen } from '@screens/System/MyAccount/ConnectedAccount';
import { LeaveAccountScreen } from '@screens/System/MyAccount/LeaveAccount';
import { LeaveAccount2Screen } from '@screens/System/MyAccount/LeaveAccount/LeaveAccount2';

const Stack = createNativeStackNavigator<SystemStackParamList>();

export const SystemStackNav = () => {
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
      <Stack.Screen name="MyAccount" component={MyAccountScreen} />
      <Stack.Screen name="ConnectedAccount" component={ConnectedAccountScreen} />
      <Stack.Screen name="LeaveAccount" component={LeaveAccountScreen} />
      <Stack.Screen name="LeaveAccount2" component={LeaveAccount2Screen} />
      <Stack.Screen name="NotificationSetting" component={NotificationSettingScreen} />
      <Stack.Screen name="Service" component={ServiceScreen} />
    </Stack.Navigator>
  );
};

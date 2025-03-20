import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { YouthHomeScreen } from '@screens/Youth/YouthHome';
import { YouthListenScreen } from '@screens/Youth/YouthListen';
import { SystemStackNav } from '@stackNav/System';

export type YouthStackParamList = {
  YouthHomeScreen: undefined;
  YouthListenScreen: {alarmId: number};
  SystemStackNav: undefined;
};

const YouthStack = createNativeStackNavigator<YouthStackParamList>();

export const YouthStackNav = () => {
  return (
    <YouthStack.Navigator screenOptions={{headerShown: false}}>
      <YouthStack.Screen
        name="YouthHomeScreen"
        component={YouthHomeScreen}
        options={{title: '청년 홈'}}
      />
      <YouthStack.Screen
        name="YouthListenScreen"
        component={YouthListenScreen}
        options={{title: '녹음 듣기'}}
      />
      <YouthStack.Screen
        name="SystemStackNav"
        component={SystemStackNav}
        options={{title: '설정'}}
      />
    </YouthStack.Navigator>
  );
};

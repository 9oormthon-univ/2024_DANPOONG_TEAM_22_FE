import {createNativeStackNavigator} from '@react-navigation/native-stack';
import YouthHomeScreen from '@screens/Youth/YouthHome';
import YouthListenScreen from '@screens/Youth/YouthListen';

export type YouthStackParamList = {
  YouthHomeScreen: undefined;
  YouthListenScreen: {alarmId: number; script: string};
};

const YouthStack = createNativeStackNavigator<YouthStackParamList>();

const YouthStackNav = () => {
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
    </YouthStack.Navigator>
  );
};

export default YouthStackNav;

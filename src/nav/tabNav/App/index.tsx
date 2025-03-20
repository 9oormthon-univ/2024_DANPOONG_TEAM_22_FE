import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {HomeStackNav} from '@stackNav/Home';
import {LetterStackNav} from '@stackNav/Letter';
import {SystemStackNav} from '@stackNav/System';
import HomeIcon from '@assets/svgs/Home.svg';
import LetterIcon from '@assets/svgs/Letter.svg';
import SystemIcon from '@assets/svgs/System.svg';
import {TabNavOptions} from '@constants/TabNavOptions';

const Tab = createBottomTabNavigator();

export const AppTabNav = () => {
  return (
    <Tab.Navigator screenOptions={TabNavOptions as BottomTabNavigationOptions}>
      <Tab.Screen
        name="HomeStackNav"
        component={HomeStackNav}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) =>
            focused ? (
              <HomeIcon style={{color: '#fafafa'}} />
            ) : (
              <HomeIcon style={{color: '#5e6071'}} />
            ),
        }}
      />
      <Tab.Screen
        name="LetterStackNav"
        component={LetterStackNav}
        options={{
          tabBarLabel: 'Letter',
          tabBarIcon: ({focused}) =>
            focused ? (
              <LetterIcon style={{color: '#fafafa'}} />
            ) : (
              <LetterIcon style={{color: '#5e6071'}} />
            ),
        }}
      />
      <Tab.Screen
        name="SystemStackNav"
        component={SystemStackNav}
        options={{
          tabBarLabel: 'System',
          tabBarIcon: ({focused}) =>
            focused ? (
              <SystemIcon style={{color: '#fafafa'}} />
            ) : (
              <SystemIcon style={{color: '#5e6071'}} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

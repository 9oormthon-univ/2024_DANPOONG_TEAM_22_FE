import {Platform} from 'react-native';

const isIOS = Platform.OS === 'ios';

export const TabNavOptions = {
  headerShown: false,
  tabBarStyle: {
    borderTopColor: 'transparent',
    backgroundColor: '#36384E',
    height: isIOS ? 100 : 78,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    position: 'absolute',
  },
  tabBarItemStyle: {flex: 1},
  tabBarIconStyle: {flex: 1},
  tabBarLabelStyle: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'WantedSans-Regular',
    lineHeight: 16.5,
    letterSpacing: -0.275,
  },
  tabBarActiveTintColor: '#fafafa',
  tabBarInactiveTintColor: '#585a6c',
};

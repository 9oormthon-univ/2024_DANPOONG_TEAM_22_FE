import { Platform } from 'react-native';

import { COLORS } from './Colors';

const isIOS = Platform.OS === 'ios';

export const TabNavOptions = {
  headerShown: false,
  tabBarStyle: {
    borderTopColor: 'transparent',
    backgroundColor: COLORS.blue500,
    height: isIOS ? 110 : 76,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 14,
    position: 'absolute',
  },
  tabBarItemStyle: { flex: 1 },
  tabBarIconStyle: { flex: 1 },
  tabBarLabelStyle: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'WantedSans-Regular',
    lineHeight: 16.5,
    letterSpacing: -0.275,
  },
  tabBarActiveTintColor: COLORS.white,
  tabBarInactiveTintColor: COLORS.blue400,
};

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppTabNav from './src/nav/tabNav/App';
import AuthStackNav from '@stackNav/Auth';
import YouthStackNav from '@stackNav/Youth';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {getMember} from '@apis/member';
import {Role} from '@type/api/member';
import {navigationRef} from 'App';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const navigateToYouthListenScreen = ({
  alarmId,
  script,
}: Readonly<{alarmId: number; script: string}>) => {
  navigationRef.navigate('YouthStackNav', {
    screen: 'YouthListenScreen',
    params: {
      alarmId,
      script,
    },
  });
};

const AppInner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        setIsLoggedIn(!!token);

        if (!token) {
          return;
        }
        const {result} = await getMember();
        console.log(result);
        setRole(result.role);
      } catch (error) {
        console.error(error);
        Alert.alert(
          '오류',
          `회원 정보를 불러오는 중 오류가 발생했어요\n${error}`,
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoggedIn && role) {
      setIsNavigationReady(true);
    }
  }, [isLoggedIn, role]);

  useEffect(() => {
    if (!isNavigationReady || role === 'HELPER') {
      return;
    }

    (async () => {
      const alarmId = await AsyncStorage.getItem('alarmId');
      const script = await AsyncStorage.getItem('script');

      if (alarmId && script) {
        navigateToYouthListenScreen({
          alarmId: Number(alarmId),
          script: script,
        });

        await AsyncStorage.removeItem('alarmId');
        await AsyncStorage.removeItem('script');
      }
    })();
  }, [isNavigationReady, role]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {isLoggedIn ? (
        <Stack.Group>
          {role === 'HELPER' ? (
            <Stack.Screen name="AppTabNav" component={AppTabNav} />
          ) : (
            <Stack.Screen name="YouthStackNav" component={YouthStackNav} />
          )}
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="AuthStackNav" component={AuthStackNav} />
          <Stack.Screen name="AppTabNav" component={AppTabNav} />
          <Stack.Screen name="YouthStackNav" component={YouthStackNav} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default AppInner;

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@type/RootStackParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppTabNav from './src/nav/tabNav/App';
import AuthStackNav from '@stackNav/Auth';
import YouthStackNav from '@stackNav/Youth';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {getMember} from '@apis/member';
import {Role} from '@type/member';

const Stack = createNativeStackNavigator<RootStackParamList>();

// font를 가져오는 함수
// const fetchFonts = () => {
//   return Font.loadAsync({
//     'WantedSans-Bold': require('./assets/fonts/WantedSans-Bold.otf'),
//     'WantedSans-SemiBold': require('./assets/fonts/WantedSans-SemiBold.otf'),
//     'WantedSans-Regular': require('./assets/fonts/WantedSans-Regular.otf'),
//     'WantedSans-Medium': require('./assets/fonts/WantedSans-Medium.otf'),
//     'Voltaire-Regular': require('./assets/fonts/Voltaire-Regular.ttf'),
//     'LeeSeoyun-Regular': require('./assets/fonts/LeeSeoyun-Regular.ttf'),
//   });
// };

const AppInner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    //   const loadFonts = async () => {
    //     await fetchFonts();
    //     setFontsLoaded(true);
    //   };

    //   loadFonts();

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

  // if (!fontsLoaded) {
  //   // 폰트가 로드되기 전에는 아무것도 렌더링하지 않음
  //   return null;
  // }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {isLoggedIn ? (
        <Stack.Group>
          {role !== 'HELPER' ? (
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

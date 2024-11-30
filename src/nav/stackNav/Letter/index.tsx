import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LetterStackParamList} from '@type/LetterStackParamList';
import LetterHomeScreen from '@screens/LetterHome';
import LetterListScreen from '@screens/LetterList';

const Stack = createNativeStackNavigator<LetterStackParamList>();

const LetterStackNav = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LetterHomeScreen" component={LetterHomeScreen} />
      <Stack.Screen name="LetterListScreen" component={LetterListScreen} />
    </Stack.Navigator>
  );
};

export default LetterStackNav;

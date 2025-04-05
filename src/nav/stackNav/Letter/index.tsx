import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LetterStackParamList} from '@type/nav/LetterStackParamList';
import { LetterHomeScreen } from '@screens/Letter/LetterHome';

const Stack = createNativeStackNavigator<LetterStackParamList>();

export const LetterStackNav = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LetterHomeScreen" component={LetterHomeScreen} />
    </Stack.Navigator>
  );
};

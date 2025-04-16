import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LetterHomeScreen } from '@screens/Letter/LetterHome';
import { type LetterStackParamList } from '@type/nav/LetterStackParamList';

const Stack = createNativeStackNavigator<LetterStackParamList>();

export const LetterStackNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LetterHomeScreen" component={LetterHomeScreen} />
    </Stack.Navigator>
  );
};

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SystemStackParamList } from "../../../types/SystemStackParamList";
import SystemScreen from "../../../screens/System";
const Stack = createNativeStackNavigator<SystemStackParamList>();

const SystemStackNav = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
        >
            <Stack.Screen name="System" component={SystemScreen}/>
        </Stack.Navigator>
    )
}

export default SystemStackNav;
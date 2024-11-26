import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '@screens/Login'
import MemberInfoWriteScreen from '@screens/MemberInfoWrite'
import NicknameWriteScreen from '@screens/NicknameWrite'
import RoleSelectScreen from '@screens/RoleSelect'
import VolunteerOnboardingScreen from '@screens/VolunteerOnboarding'

export type AuthStackParamList = {
  LoginScreen: undefined
  NicknameWriteScreen: undefined
  RoleSelectScreen: { nickname: string; imageUri: string }
  MemberInfoWriteScreen: { nickname: string; imageUri: string; role: string }
  VolunteerOnboardingScreen: undefined
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const AuthStackNav = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: '로그인' }}
      />
      <AuthStack.Screen
        name="NicknameWriteScreen"
        component={NicknameWriteScreen}
        options={{ title: '닉네임 입력' }}
      />
      <AuthStack.Screen
        name="RoleSelectScreen"
        component={RoleSelectScreen}
        options={{ title: '역할 선택' }}
      />
      <AuthStack.Screen
        name="MemberInfoWriteScreen"
        component={MemberInfoWriteScreen}
        options={{ title: '정보 입력' }}
      />
      <AuthStack.Screen
        name="VolunteerOnboardingScreen"
        component={VolunteerOnboardingScreen}
        options={{ title: '온보딩' }}
      />
    </AuthStack.Navigator>
  )
}

export default AuthStackNav

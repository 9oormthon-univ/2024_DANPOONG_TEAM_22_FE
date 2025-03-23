import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { LoginScreen } from '@screens/Login';
import { MemberInfoWriteScreen } from '@screens/Login/MemberInfoWrite';
import { NicknameWriteScreen } from '@screens/Login/NicknameWrite';
import { RoleSelectScreen } from '@screens/Login/RoleSelect';
import { VolunteerNoticeScreen } from '@screens/Login/VolunteerNotice';
import { VolunteerOnboardingScreen } from '@screens/Login/VolunteerOnboarding';
import { YouthEatScreen } from '@screens/Login/YouthEat';
import { YouthNoticeScreen } from '@screens/Login/YouthNotice';
import { YouthOnboardingScreen } from '@screens/Login/YouthOnboarding';
import { YouthSleepTimeScreen } from '@screens/Login/YouthSleepTime';
import { YouthWakeUpTimeScreen } from '@screens/Login/YouthWakeUpTime';

export type AuthStackParamList = {
  // 공통
  LoginScreen: undefined;
  RoleSelectScreen: undefined;
  NicknameWriteScreen: {role: string};
  MemberInfoWriteScreen: {role: string; nickname: string; imageUri: string}; // 여기서 가입시킨다
  // 봉사자
  VolunteerOnboardingScreen: undefined;
  VolunteerNoticeScreen: undefined;
  // 청년
  YouthOnboardingScreen: undefined;
  YouthWakeUpTimeScreen: undefined;
  YouthEatScreen: {
    wakeUpTime: string;
  };
  YouthSleepTimeScreen: {
    wakeUpTime: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  YouthNoticeScreen: {
    wakeUpTime: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    sleepTime: string;
  }; // 여기서 추가정보 저장한다
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNav = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{title: '로그인'}}
      />
      <AuthStack.Screen
        name="RoleSelectScreen"
        component={RoleSelectScreen}
        options={{title: '역할 선택'}}
      />
      <AuthStack.Screen
        name="NicknameWriteScreen"
        component={NicknameWriteScreen}
        options={{title: '닉네임 입력 및 프로필사진 등록'}}
      />
      <AuthStack.Screen
        name="MemberInfoWriteScreen"
        component={MemberInfoWriteScreen}
        options={{title: '생년월일/성별 입력'}}
      />
      <AuthStack.Screen
        name="VolunteerOnboardingScreen"
        component={VolunteerOnboardingScreen}
        options={{title: '봉사자 온보딩'}}
      />
      <AuthStack.Screen
        name="VolunteerNoticeScreen"
        component={VolunteerNoticeScreen}
        options={{title: '봉사자 주의사항'}}
      />
      <AuthStack.Screen
        name="YouthOnboardingScreen"
        component={YouthOnboardingScreen}
        options={{title: '청년 온보딩'}}
      />
      <AuthStack.Screen
        name="YouthWakeUpTimeScreen"
        component={YouthWakeUpTimeScreen}
        options={{title: '청년 기상 시간 입력'}}
      />
      <AuthStack.Screen
        name="YouthEatScreen"
        component={YouthEatScreen}
        options={{title: '청년 식사 시간 입력'}}
      />
      <AuthStack.Screen
        name="YouthSleepTimeScreen"
        component={YouthSleepTimeScreen}
        options={{title: '청년 취침 시간 입력'}}
      />
      <AuthStack.Screen
        name="YouthNoticeScreen"
        component={YouthNoticeScreen}
        options={{title: '청년 주의사항'}}
      />
    </AuthStack.Navigator>
  );
};

import BG from "@components/atom/BG";
import Txt from "@components/atom/Txt";
import { View } from "react-native";
import AppBar from "@components/atom/AppBar";
import { NavigationProp, useNavigation} from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import ProfileIcon from '@assets/svgs/Profile.svg';
import ProfileCameraIcon from '@assets/svgs/ProfileCamera.svg';
const ModifyInfoScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  return (
    <BG type="solid">
      <AppBar 
      title="내 정보 수정" 
      goBackCallbackFn={() => {
          navigation.goBack();
        }}/>
      <View className="flex-1 items-center pt-[38]">
        <View className="relative ">
        <ProfileIcon/>
        <ProfileCameraIcon className="absolute right-[-8] bottom-[0]"/>
        </View>
        <View className="h-[39]" />
        {/* 닉네임 수정 Section */}
        <View className="w-full px-px gap-y-[10]">
            <Txt type="caption1" text="닉네임" className="ml-[9] text-gray200"/>
            <View className="w-full h-[48] bg-gray100 rounded-lg"/>
            <Txt type="caption1" text="2자 이상 10자 이내의 한글,영문,숫자 입력 가능합니다." className="ml-[9] text-gray400"/>
        </View>
      </View>
    </BG>
  );
};

export default ModifyInfoScreen;


import {AppBar} from "@components/AppBar";
import {BG} from "@components/BG";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import KakaoLogo from "@assets/svgs/KakaoLogo.svg";
import { View } from "react-native";
import { CustomText } from "@components/CustomText";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const ConnectedAccountScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [email, setEmail] = useState('');
  useEffect(() => {
    (async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) setEmail(storedEmail);
    })();
  }, []);
  return <BG type="solid">

    <AppBar title="연결된 소셜 계정" goBackCallbackFn={() => {navigation.goBack();}} />
        {/* 전체 컨테이너 */}
        <View className="flex-1 items-center px-px  pt-[28]">
            {/* 연결된 소셜 계정 컨테이너 */}
            <View className="w-full h-[89] bg-blue600 rounded-[10px] px-[27] py-[17]">
                <View className="flex-row items-center gap-[10]">
                    <KakaoLogo />
                    <CustomText type="caption1" text="카카오 계정" className="text-gray200" />
                </View>
                <View className="w-full h-[27] overflow-hidden"><CustomText type="body3" text={email} className="text-white" /></View>

            </View>
        </View>
  </BG>;
};


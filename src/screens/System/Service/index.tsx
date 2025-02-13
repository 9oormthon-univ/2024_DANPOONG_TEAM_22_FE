import AppBar from "@components/atom/AppBar";
import BG from "@components/atom/BG";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import SystemButton from "@components/atom/SystemButton";
import { View } from "react-native";
import Txt from "@components/atom/Txt";
  const ServiceScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  return <BG type="solid">
    <AppBar title="서비스" goBackCallbackFn={() => {navigation.goBack();}} />
    {[
      {title: "내일모래 새소식", onPress: () => {}},
      {title: "문의하기", onPress: () => {}},
      {title: "서비스 이용 약관", onPress: () => {}}, 
      {title: "개인정보 처리 방침", onPress: () => {}}
    ].map((item, index) => (
      <SystemButton 
        key={index}
        title={item.title} 
        onPress={item.onPress}
        type="link"
      />
    ))}
     <View 
      className="w-full flex-row justify-between items-center px-px py-[21]"     >
        {/* 텍스트 영역 */}
        <View className="flex-1">
          {/* 메뉴 제목 */}
          <View className="flex-row justify-start items-center gap-x-[11]"><Txt type="body3" text={`현재 버전 1.0.0`} className="text-gray300"/></View>
         
        </View>
      <View className="px-[17] py-[6] bg-gray300 rounded-full">
        <Txt type="caption1" text="업데이트" className="text-white"/>
        </View>
      </View>
  </BG>;
};

export default ServiceScreen;

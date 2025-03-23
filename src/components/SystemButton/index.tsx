import { View } from "react-native";
import { Pressable } from "react-native";
import {CustomText} from '@components/CustomText';
import {ToggleSwitch} from "@components/ToggleSwitch";
//
import BackIcon from "@assets/svgs/Back.svg";
import KakaoLogo from "@assets/svgs/KakaoLogo.svg";
import ArrowRightUpIcon from "@assets/svgs/ArrowRightUp.svg";
//
import { COLORS } from "@constants/Colors";
// 시스템 메뉴 버튼 컴포넌트
export const SystemButton = ({
  title, 
  sub,
  kakaoLogo,
  onPress,
  type,
  isOn,
}: {
  title: string;
  sub?: string;
  kakaoLogo?: boolean;
  onPress?: () => void;
  type: 'button' | 'toggle' | 'link';
  isOn?: boolean;
}) => {
    return (
      // 버튼 컨테이너
      <Pressable 
      onPress={onPress}
      className="w-full flex-row justify-between items-center px-px py-[21]"
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLORS.blue600 : 'transparent'
      })}
      android_ripple={{color: COLORS.blue600}}>
        {/* 텍스트 영역 */}
        <View className="flex-1">
          {/* 메뉴 제목 */}
          <View className="flex-row justify-start items-center gap-x-[11]"><CustomText type="body3" text={title} className="text-white"/>{kakaoLogo && <KakaoLogo/>}</View>
          {/* 간격 조정 */}
          <View className="h-[4.9]" />
          {/* 메뉴 설명 */}
          {sub && <CustomText type="caption1" text={sub} className="text-gray400" />}
        </View>
        {/* 화살표 아이콘 */}
        {type === 'button' && <BackIcon />}
        {type === 'toggle' && (
            <ToggleSwitch isOn={isOn ?? false} onToggle={onPress ?? (() => {})} />
        )}
        {type === 'link' && <ArrowRightUpIcon />}
      </Pressable>
    );
  };
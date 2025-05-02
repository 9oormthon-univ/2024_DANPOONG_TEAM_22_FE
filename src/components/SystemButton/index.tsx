import { Image, Pressable, StyleSheet, View } from 'react-native';

import { CustomText } from '@components/CustomText';
import { ToggleSwitch } from '@components/ToggleSwitch';
import { COLORS } from '@constants/Colors';

import ArrowRightUpIcon from '@assets/svgs/ArrowRightUp.svg';
import BackIcon from '@assets/svgs/Back.svg';
import KakaoLogo from '@assets/svgs/KakaoLogo.svg';

// 시스템 메뉴 버튼 컴포넌트
export const SystemButton = ({
  title,
  sub,
  loginType,
  onPress,
  type,
  isOn,
}: {
  title: string;
  sub?: string;
  loginType?: string;
  onPress?: () => void;
  type: 'button' | 'toggle' | 'link';
  isOn?: boolean;
}) => {
  return (
    // 버튼 컨테이너
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}>
      {/* 텍스트 영역 */}
      <View className="flex-1">
        {/* 메뉴 제목 */}
        <View className="flex-row justify-start items-center gap-x-[11]">
          <CustomText type="body3" text={title} className="text-white" />
          {loginType == 'KAKAO' && <KakaoLogo />}
          {loginType == 'APPLE' && (
            <Image
              source={{
                uri: 'https://ip-file-upload-test.s3.ap-northeast-2.amazonaws.com/assets/apple_logo_white_32.png',
              }}
              className="w-[16] h-[16]"
              resizeMode="contain"
            />
          )}
        </View>
        {/* 간격 조정 */}
        <View className="h-[4.9]" />
        {/* 메뉴 설명 */}
        {sub && (
          <CustomText type="caption1" text={sub} className="text-gray400" />
        )}
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

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 21,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    width: '100%',
  },
  pressed: {
    backgroundColor: COLORS.blue600,
  },
});

import { StatusBar, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { COLORS } from '@constants/Colors';
import { BackType } from '@type/BackType';

type Props = {
  type: BackType;
  isShowStatusBar?: boolean;
  children?: React.ReactNode;
};

export const BG = ({ type, isShowStatusBar = true, children }: Props) => {
  const colors: [string, string] =
    type === BackType.MAIN
      ? [COLORS.main100, COLORS.main200]
      : [COLORS.second100, COLORS.second200];

  const { top: statusBarHeight } = useSafeAreaInsets();

  const backgroundColor =
    type === BackType.MAIN
      ? COLORS.main100
      : type === BackType.SOLID
      ? COLORS.blue700
      : COLORS.second100;

  return (
    <SafeAreaView className={`flex-1`} edges={[]}>
      {/* 상태바 높이 설정 */}
      {isShowStatusBar && (
        <View style={{ backgroundColor, height: statusBarHeight }} />
      )}
      {/* 상태바 설정 */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />
      {/* 배경 설정 */}
      {type === BackType.SOLID ? (
        <View className="flex-1 bg-blue700">{children}</View>
      ) : (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0.15 }}
          end={{ x: 0, y: 1 }}
          className="flex-1">
          {children}
        </LinearGradient>
      )}
    </SafeAreaView>
  );
};

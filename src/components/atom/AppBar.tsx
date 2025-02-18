// 필요한 컴포넌트 및 아이콘 import
import Txt from '@components/atom/Txt';
import {Pressable, View, ViewStyle, ActivityIndicator} from 'react-native';
import ChevronLeftWhiteIcon from '@assets/svgs/chevron/chevron_left_white.svg';
import ExitWhiteIcon from '@assets/svgs/exit_white.svg';
// AppBar 컴포넌트의 props 타입 정의
type AppBarProps = {
  title?: string;
  goBackCallbackFn?: () => void;
  exitCallbackFn?: () => void;
  confirmCallbackFn?: () => void;
  skipCallbackFn?: () => void;
  className?: string;
  style?: ViewStyle | ViewStyle[];
  isLoading?: boolean; // 로딩 상태(완료버튼 클릭시 로딩 상태)

};
// AppBar 컴포넌트
const AppBar = ({
  title,
  goBackCallbackFn,
  exitCallbackFn,
  confirmCallbackFn,
  skipCallbackFn,
  isLoading,
  ...props
}: Readonly<AppBarProps>) => {
  const renderRightButton = (
    exitCallbackFn?: () => void,
    confirmCallbackFn?: () => void,
    skipCallbackFn?: () => void,
  ) => {
    if (exitCallbackFn)
      return (
        <Pressable
          className="flex-1 py-[18] flex-row justify-end"
          onPress={exitCallbackFn}>
          <ExitWhiteIcon />
        </Pressable>
      );
    if (confirmCallbackFn)
      return (
        <Pressable
          className="flex-1 py-[18] flex-row justify-end"
          onPress={confirmCallbackFn}>
          {isLoading ? 
          <ActivityIndicator size="small" color="#fafafa" /> : 
          <Txt type="title4" text="완료" className="text-white"/>}
        </Pressable>
      );
    if (skipCallbackFn)
      return (
        <Pressable
          className="flex-1 py-[18] flex-row justify-end"
          onPress={skipCallbackFn}>
          <Txt type="button" text="건너뛰기" className="text-white " />
        </Pressable>
      );
    return <View className="flex-1" />;
  };

  return (
    // 메인 컨테이너
    <View
      {...props}
      className={`flex-row items-center justify-between px-[16] border-b border-b-white/5 ${props.className}`}
      style={[props.style]}>
      {/* 왼쪽 영역: 뒤로가기 버튼 또는 빈 공간 */}
      {goBackCallbackFn ? (
        <Pressable className="flex-1 py-[18]" onPress={goBackCallbackFn}>
          <ChevronLeftWhiteIcon />
        </Pressable>
      ) : (
        <View className="flex-1" />
      )}
      {/* 중앙 영역: 제목 또는 빈 공간 */}
      {title ? (
        <Txt
          type="button"
          text={title}
          className="text-white text-center flex-1 py-[18]"
        />
      ) : (
        <View className="flex-1" />
      )}
      {renderRightButton(exitCallbackFn, confirmCallbackFn, skipCallbackFn)}
    </View>
  );
};

export default AppBar;

import ChevronLeftWhiteIcon from '@assets/svgs/chevron/chevron_left_white.svg';
import ExitWhiteIcon from '@assets/svgs/exit_white.svg';
import Txt from '@components/atom/Txt';
import {Pressable, View, ViewStyle} from 'react-native';
type AppBarProps = {
  title?: string;
  goBackCallbackFn?: () => void;
  exitCallbackFn?: () => void;
  confirmCallbackFn?: () => void;
  skipCallbackFn?: () => void;
  className?: string;
  style?: ViewStyle | ViewStyle[];
};

const AppBar = ({
  title,
  goBackCallbackFn,
  exitCallbackFn,
  confirmCallbackFn,
  skipCallbackFn,
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
          <Txt type="title4" text="완료" className="text-white " />
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
    <View
      {...props}
      className={`flex-row items-center justify-between px-[16] border-b border-b-white/5 ${props.className}`}
      style={[props.style]}>
      {goBackCallbackFn ? (
        <Pressable className="flex-1 py-[18]" onPress={goBackCallbackFn}>
          <ChevronLeftWhiteIcon />
        </Pressable>
      ) : (
        <View className="flex-1" />
      )}
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

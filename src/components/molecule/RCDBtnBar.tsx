import {View, TouchableOpacity} from 'react-native';
import RCDBtn from '@components/atom/RCDBtn';
import Txt from '@components/atom/Txt';
import {RCDBtnBarProps} from '@type/component/RCDBtnBarType';

const TransparentButton = ({
  content,
  color,
  onPress,
}: {
  content: string;
  color: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className="w-auto h-auto justify-center items-center px-btn"
      onPress={onPress}>
      <Txt type="body1" text={content} style={{color}} />
    </TouchableOpacity>
  );
};

const RCDBtnBar = ({
  record,
  // pause,
  play,
  upload,
  isPlaying,
  // isPaused,
  isDone,
  recording,
  reflesh,
  stop,
}: RCDBtnBarProps) => {
  const justifyType = isDone ? 'between' : 'center';
  return (
    <View
      className={`w-full h-20 flex flex-row justify-${justifyType} items-center`}>
      {isDone && (
        <TransparentButton
          content="다시"
          color="gray_300"
          onPress={async () => {
            await reflesh();
            await record();
          }}
        />
      )}
      <RCDBtn
        record={record}
        // pause={pause}
        play={play}
        isPlaying={isPlaying}
        // isPaused={isPaused}
        recording={recording}
        isDone={isDone}
        stop={stop}
      />
      {isDone && (
        <TransparentButton content="완료" color="gray_100" onPress={upload} />
      )}
    </View>
  );
};
export default RCDBtnBar;

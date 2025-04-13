import Play from '@assets/svgs/play.svg';
import {TouchableOpacity} from 'react-native';
// import Pause from '@assets/svgs/pause.svg'
import Circle from '@assets/svgs/Circle.svg';
import Halt from '@assets/svgs/Halt.svg';
import {useEffect, useState} from 'react';
import {RCDBtnProps} from '@type/component/RCDBtnType';

export const RCDBtn = ({
  record,
  // pause,
  play,
  isPlaying,
  // isPaused,
  isDone,
  recording,
  stop,
}: RCDBtnProps) => {
  const [type, setType] = useState<'ready' | 'recording' | 'done'>('ready'); // 버튼의 상태

  useEffect(() => {
    //녹음 상태에 따라 버튼의 상태를 업데이트
    if (isDone) {
      setType('done');
    } else if (!recording) {
      setType('ready');
    } else if (recording) {
      setType('recording');
    }
  }, [recording, isDone]);

  const pressHandler = () => {
    if (type === 'ready' && !recording) {
      record();
    } //type이  ready 이고 진행중이던 녹음이 없으면 녹음을 시작
    else if (type === 'recording') {
      stop();
    } //녹음중 이면 녹음 완료
    else if (type === 'done' || !isPlaying) {
      play();
    } // 녹음 완료 이면 재생, 재생중이지 않으면
  };
  return (
    <TouchableOpacity
      style={{
        width: 69,
        aspectRatio: 1,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={pressHandler}>
      {type === 'ready' && <Circle />}
      {type === 'recording' && <Halt />}
      {type === 'done' && <Play />}
    </TouchableOpacity>
  );
};

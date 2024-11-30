import {View} from 'react-native';
import Txt from './Txt';
import {useEffect, useState} from 'react';
import useInterval from '@hooks/useInterval';

type RCDTimerProps = {
  recording: boolean; // 녹음 중 여부를 따져 타이머를 시작시키기 위함
  stop: () => void; //시간이 되면 녹음을 중지
  type: 'DAILY' | 'COMFORT'; //타이머 초를 결정하기 위함
};

const RCDTimer = ({recording, stop, type}: RCDTimerProps) => {
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState(
    type === 'DAILY' ? 15000 : 30000,
  );
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (recording) {
      const target = new Date();
      target.setSeconds(target.getSeconds() + (type === 'DAILY' ? 15 : 30));
      setTargetTime(target);
      setRemainingTime(type === 'DAILY' ? 15000 : 30000);
      setIsStopped(false);
    }
  }, [recording]);

  useInterval(() => {
    if (recording && targetTime && !isStopped) {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();
      setRemainingTime(diff);

      if (diff <= 0) {
        stop();
        setRemainingTime(0);
        setIsStopped(true);
      }
    }
  }, 10);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
    const ss = String(totalSeconds).padStart(2, '0');
    const ms = String(
      Math.floor(Math.max(0, milliseconds) / 10) % 100,
    ).padStart(2, '0');
    return `${ss}:${ms}`;
  };

  return (
    <View className="w-full h-20 justify-center items-center">
      <Txt
        type="recording"
        text={formatTime(remainingTime)}
        className={`${
          remainingTime < 5000 && remainingTime > 0
            ? 'text-recording'
            : 'text-white'
        }`}
      />
    </View>
  );
};

export default RCDTimer;

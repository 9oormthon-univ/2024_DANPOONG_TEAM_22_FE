import {View} from 'react-native';
import {CustomText} from '@components/CustomText';
import {useEffect, useState} from 'react';
import {useInterval} from '@hooks/useInterval';
import {RecordType} from '@type/RecordType';

type RCDTimerProps = {
  recording: boolean; // 녹음 중 여부를 따져 타이머를 시작시키기 위함
  stop: () => void; //시간이 되면 녹음을 중지
  type: RecordType; //타이머 초를 결정하기 위함
  onTimeUpdate?: (elapsedTime: number) => void; // 경과 시간을 전달하기 위한 콜백 추가
  shouldRefresh?: boolean; // 리프레시 상태를 받는 prop 추가
  setShouldRefresh?: (shouldRefresh: boolean) => void; // 리프레시 상태를 설정하기 위한 콜백 추가
};

export const RCDTimer = ({recording, stop, type, onTimeUpdate, shouldRefresh, setShouldRefresh}: RCDTimerProps) => {
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState(
    type === 'COMFORT' ? 30000 : 15000,
  );
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (recording) {
      const target = new Date();
      target.setSeconds(target.getSeconds() + (type === 'COMFORT' ? 30 : 15));
      setTargetTime(target);
      setRemainingTime(type === 'COMFORT' ? 30000 : 15000);
      setIsStopped(false);
    }
  }, [recording]);

  const refreshTimer = () => {
    setTargetTime(null);
    setRemainingTime(type === 'COMFORT' ? 30000 : 15000);
    setIsStopped(false);
    setShouldRefresh?.(false);
  };

  useEffect(() => {
    if (shouldRefresh) {
      console.log('refreshTimer');
      refreshTimer();
    }
  }, [shouldRefresh]);

  useInterval(() => {
    if (recording && targetTime && !isStopped) {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();
      setRemainingTime(diff);

      // 경과 시간 계산 및 콜백 호출
      const totalTime = type === 'COMFORT' ? 30000 : 15000;
      const elapsedTime = totalTime - diff;
      onTimeUpdate?.(elapsedTime);

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
      <CustomText        type="recording"
        text={formatTime(remainingTime)}
        className={`${
          remainingTime < 5000 && remainingTime > 0 ? 'text-red' : 'text-white'
        }`}
      />
    </View>
  );
};
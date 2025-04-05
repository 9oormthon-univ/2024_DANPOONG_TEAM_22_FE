import {navigationRef} from 'App';

/**
 * 청소년 듣기 화면으로 네비게이션하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 알람 ID를 사용하여 청소년 듣기 화면으로 이동합니다.
 * 
 * 입력:
 * @param {object} params - 네비게이션 매개변수
 * @param {number} params.alarmId - 이동할 화면에 전달할 알람 ID
 * 
 * 출력:
 * @returns {void} - 반환값 없음, 화면 이동 수행
 */
export const navigateToYouthListenScreen = ({
  alarmId,
}: Readonly<{alarmId: number}>) => {
  navigationRef.navigate('YouthStackNav', {
    screen: 'YouthListenScreen',
    params: {
      alarmId,
    },
  });
};

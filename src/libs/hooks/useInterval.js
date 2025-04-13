/**
 * 일정 간격으로 함수를 실행하는 인터벌 훅
 * 
 * 설명:
 * 이 훅은 지정된 시간 간격으로 콜백 함수를 반복 실행합니다.
 * React 컴포넌트에서 setInterval을 안전하게 사용할 수 있도록 해줍니다.
 * 컴포넌트가 언마운트될 때 자동으로 인터벌을 정리합니다.
 * 
 * 입력:
 * @param {Function} callback - 주기적으로 실행할 함수
 * @param {number|null} delay - 실행 간격(밀리초), null이면 인터벌 중지
 * 
 * 출력: 없음
 */
import {useEffect, useRef} from 'react';

export const useInterval = (callback, delay) => {
  const savedCallback = useRef(); //클로저 역할을 해주는 useRef. 렌더를 해도 초기화 되지 않는다.

  // callback(setCount)가 변경될 때를 useEffect가 감지해서 최신상태를 저장한다.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 인터벌과 클리어 세팅
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id); //바로바로 클리어를 해주기 때문에 메모리를 차지하지 않는다.
    }
  }, [delay]);
}

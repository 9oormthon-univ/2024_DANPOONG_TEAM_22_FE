import { useEffect, useMemo, useRef } from 'react';

import { debounce, type DebounceSettings } from 'lodash-es';

const DEFAULT_WAIT = 500;
// leading 이 true 인 경우, 첫 번째 이벤트가 발생 후 wait 으로 대입된 밀리세컨드 만큼이 지난 후 첫 번째 이벤트 하나가 반영된다.
// trailing 이 true 인 경우, 마지막 이벤트가 발생 후 wait 으로 대입된 밀리세컨드 만큼이 지난 후 첫 번째 마지막 하나가 반영된다.
const DEFAULT_DEBOUNCE_SETTINGS = { leading: true, trailing: false };

/**
 * debounce 적용을 위한 커스텀 훅 (lodash-es 의 debounce 사용)
 * @param callback debounce 를 적용할 콜백함수
 * @param wait debounce - wait time (default = 500ms)
 * @param options DebounceSettings 타입의 객체 (default = { leading: true, trailing: false })
 * @returns {F} debounced callback
 */
export const useDebounce = <F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait: number = DEFAULT_WAIT,
  options: DebounceSettings = DEFAULT_DEBOUNCE_SETTINGS,
) => {
  // 참조가 유지되는 ref
  const callbackRef = useRef<F>(callback);

  useEffect(() => {
    // callback 의 참조가 변경될 때 callbackRef.current 값 업데이트
    callbackRef.current = callback;
  }, [callback]);

  const { leading, trailing, maxWait } = options;

  const debounced = useMemo(() => {
    // wait 과 options 의 필드값이 바뀔 때만 callbackRef 로 debounced 함수를 새로 생성한다.
    return debounce((...args) => callbackRef.current(...args), wait, {
      leading,
      trailing,
      maxWait,
    });
  }, [wait, leading, trailing, maxWait]);

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced as unknown as F; // 사용 편의를 위해 callback 과 동일한 타입으로 type assertion
};

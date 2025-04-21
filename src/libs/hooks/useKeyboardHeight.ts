import { useEffect, useRef, useState } from 'react';
import { Keyboard, type KeyboardEvent } from 'react-native';

const DEFAULT_KEYBOARD_HEIGHT = 290;

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const maxHeightRef = useRef(0);

  useEffect(() => {
    const onKeyboardDidShow = (e: KeyboardEvent) => {
      const height = e.endCoordinates.height;

      if (height > maxHeightRef.current) {
        maxHeightRef.current = height;
      }

      setKeyboardHeight(height);
    };

    const onKeyboardDidHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return {
    keyboardHeight,
    maxKeyboardHeight:
      maxHeightRef.current === 0
        ? DEFAULT_KEYBOARD_HEIGHT
        : maxHeightRef.current,
  };
};

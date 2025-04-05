import Toast from 'react-native-toast-message';

import {
  type CustomToastPosition,
  type CustomToastType,
} from '@components/CustomToast';

type Props = {
  text: string;
  type: CustomToastType;
  position: CustomToastPosition;
};

export const showToast = ({ text, type, position }: Props) => {
  return Toast.show({
    type: 'custom',
    text1: text,
    position: position === 'bottom' ? 'bottom' : 'top',
    props: { type, position },
  });
};

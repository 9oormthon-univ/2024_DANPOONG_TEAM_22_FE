import Toast from 'react-native-toast-message';

type Props = {
  text: string;
  type: 'check' | 'notice';
  position: 'left';
};

export const showToast = ({ text, type, position }: Props) => {
  return Toast.show({
    type: 'custom',
    text1: text,
    props: { type, position },
  });
};

import { TextProps } from '@components/atom/title/Title1';
import { Text } from 'react-native';

const EmptyText = ({ text, ...props }: Readonly<TextProps>) => {
  const size = 14;

  return (
    <Text
      {...props}
      className={`text-gray300 ${props.className}`}
      style={[
        {
          fontFamily: 'WantedSans-Medium',
          fontSize: size,
          lineHeight: size * 1.5,
          letterSpacing: size * -0.025,
        },
        props.style,
      ]}
    >
      {text}
    </Text>
  );
};

export default EmptyText;

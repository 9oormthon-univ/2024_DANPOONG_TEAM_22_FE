import {TextProps} from '@type/component/TextType';
import {Text, TextStyle} from 'react-native';

const getStyle = (type: string): TextStyle => {
  const fontStyles = {
    title1: {
      fontFamily: 'WantedSans-SemiBold',
      fontSize: 30,
      lineHeight: 30 * 1.5,
      letterSpacing: 30 * -0.025,
    },
    title2: {
      fontFamily: 'WantedSans-SemiBold',
      fontSize: 25,
      lineHeight: 25 * 1.5,
      letterSpacing: 25 * -0.025,
    },
    title3: {
      fontFamily: 'WantedSans-Medium',
      fontSize: 22,
      lineHeight: 22 * 1.5,
      letterSpacing: 22 * -0.025,
    },
    title4: {
      fontFamily: 'WantedSans-SemiBold',
      fontSize: 20,
      lineHeight: 20 * 1.5,
      letterSpacing: 20 * -0.025,
    },
    body1: {
      fontFamily: 'WantedSans-Regular',
      fontSize: 22,
      lineHeight: 22 * 1.5,
      letterSpacing: 22 * -0.025,
    },
    body2: {
      fontFamily: 'WantedSans-Regular',
      fontSize: 20,
      lineHeight: 20 * 1.5,
      letterSpacing: 20 * -0.025,
    },
    body3: {
      fontFamily: 'WantedSans-Regular',
      fontSize: 18,
      lineHeight: 18 * 1.5,
      letterSpacing: 18 * -0.025,
    },
    body4: {
      fontFamily: 'WantedSans-Regular',
      fontSize: 15,
      lineHeight: 15 * 1.5,
      letterSpacing: 15 * -0.025,
    },
    recording: {
      fontFamily: 'WantedSans-Regular',
      fontSize: 32,
      lineHeight: 32 * 1.5,
      letterSpacing: 32 * -0.025,
    },
    button: {
      fontFamily: 'WantedSans-Medium',
      fontSize: 18,
      lineHeight: 18 * 1.5,
      letterSpacing: 18 * -0.025,
    },
    caption1: {
      fontFamily: 'WantedSans-Medium',
      fontSize: 14,
      lineHeight: 14 * 1.5,
      letterSpacing: 14 * -0.025,
    },
    caption2: {
      fontFamily: 'WantedSans-Medium',
      fontSize: 12,
      lineHeight: 12 * 1.5,
      letterSpacing: 12 * -0.025,
    },
    caption3: {
      fontFamily: 'WantedSans-SemiBold',
      fontSize: 11,
      lineHeight: 11 * 1.5,
      letterSpacing: 11 * -0.025,
    },
  };

  return fontStyles[type as keyof typeof fontStyles];
};

export const CustomText = ({text, type, ...props}: TextProps) => {
  const style = getStyle(type);
  return (
    <Text      {...props}
      className={props.className}
      style={[style, props.style]}
      numberOfLines={props.numberOfLines}>
      {text}
    </Text>
  );
};

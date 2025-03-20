import {TextStyle} from 'react-native';

export type TextProps = {
  text: string;
  type:
    | 'title1'
    | 'title2'
    | 'title3'
    | 'title4'
    | 'body1'
    | 'body2'
    | 'body3'
    | 'body4'
    | 'caption1'
    | 'caption2'
    | 'caption3'
    | 'recording'
    | 'button';
  className?: string;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
};

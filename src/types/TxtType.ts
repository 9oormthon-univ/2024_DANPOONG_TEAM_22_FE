import {TextStyle} from 'react-native';

export type TxtProps = {
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
    | 'button'
    | 'recording'
    | 'caption1';
  className?: string;
  style?: TextStyle | TextStyle[];
};

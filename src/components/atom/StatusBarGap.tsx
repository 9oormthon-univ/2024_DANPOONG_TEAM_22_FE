import { View } from 'react-native';
import useStatusBarHeight from '@hooks/useStatusBarHeight';

export default function StatusBarGap({times}: {times?: number}) {
  const statusBarHeight = useStatusBarHeight();
  return <View style={{height: times ? times * statusBarHeight : statusBarHeight}} />;
}

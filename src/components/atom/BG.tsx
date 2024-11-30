import {View, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const BG = ({
  type,
  children,
}: {
  type: 'gradation' | 'solid' | 'main';
  children?: React.ReactNode;
}) => {
  const Container = Platform.OS === 'android' ? View : SafeAreaView;
  const colors: [string, string] =
    type === 'main' ? ['#121320', '#252738'] : ['#252738', '#393C52'];
  return (
    <Container style={{width: '100%', height: '100%'}}>
      {type === 'solid' ? (
        <View
          style={{backgroundColor: '#252738', width: '100%', height: '100%'}}>
          {children}
        </View>
      ) : (
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0.15}}
          end={{x: 0, y: 1}}
          style={{width: '100%', height: '100%'}}>
          {children}
        </LinearGradient>
      )}
    </Container>
  );
};

export default BG;

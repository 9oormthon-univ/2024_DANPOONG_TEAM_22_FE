import {View, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {BackType} from '@type/BackType';
import {COLORS} from '@constants/Colors';
const BG = ({type, children}: {type: BackType; children?: React.ReactNode}) => {
  const Container = Platform.OS === 'android' ? View : SafeAreaView;
  const colors: [string, string] =
    type === 'main'
      ? [COLORS.main100, COLORS.main200]
      : [COLORS.second100, COLORS.second200];
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

import {View, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {BackType} from '@type/BackType';
import {COLORS} from '@constants/Colors';
const BG = ({type, children}: {type: BackType; children?: React.ReactNode}) => {
  const colors: [string, string] =
    type === BackType.MAIN
      ? [COLORS.main100, COLORS.main200]
      : [COLORS.second100, COLORS.second200];
  return (
    <SafeAreaView className="w-full h-full">
      <StatusBar
        barStyle="light-content"
        backgroundColor={type === BackType.MAIN ? COLORS.main100 : type === BackType.SOLID ? COLORS.blue700 : COLORS.second100}
        translucent={false}
      />
      {type === BackType.SOLID ? (
        <View className="w-full h-full bg-blue700">
          {children}
        </View>
      ) : (
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0.15}}
          end={{x: 0, y: 1}}
          className="w-full h-full">
          {children}
        </LinearGradient>
      )}
    </SafeAreaView>
  );
};

export default BG;

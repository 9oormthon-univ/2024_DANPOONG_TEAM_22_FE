import {View, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {BackType} from '@type/BackType';

const BG = ({
  type,
  children,
}: {
  type: BackType;
  children?: React.ReactNode;
}) => {
  const colors: [string, string] =
    type === 'main' 
      ? ['#16161f', '#2b2d3e'] // blue.800, blue.600
      : ['#20222f', '#36384e']; // blue.700, blue.500

  return (
    <SafeAreaView className="w-full h-full">
      <StatusBar
        barStyle="light-content"
        backgroundColor={type === 'main' ? '#16161f' : '#20222f'}
        translucent={false}
      />
      {type === 'solid' ? (
        <View className="w-full h-full bg-blue-700">
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

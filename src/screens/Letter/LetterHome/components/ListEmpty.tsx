import EmptyLetterIcon from '@assets/svgs/emptyLetter.svg';
import Txt from '@components/atom/Txt';
import {View} from 'react-native';

const ListEmpty = () => {
  return (
    <View className="items-center justify-center pt-[40]">
      <EmptyLetterIcon />
      <View className="h-[26.27]" />
      <Txt
        type="caption1"
        text={`아직 받은 편지가 없어요\n청년들에게 더 많은 목소리를 전해보세요`}
        className="text-blue300 text-center"
      />
    </View>
  );
};

export default ListEmpty;

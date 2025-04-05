import { View } from "react-native";

export const FlexableMargin = ({flexGrow}: {flexGrow: number}) => {
  return <View style={{flexGrow: flexGrow, flexShrink: 0, flexBasis: 0}} />;
};
/*
빈 여백을 조절할 수 있는 컴포넌트입니다
기본적으로 크기는 0이고 사용시 다른 컴포넌트를 배치하고 남은 여백만큼 성장합니다.

FlexableMargin 컴포넌트를 같은 View 안에서 두 개 이상 배치할 때는,
flexGrow 값을 다르게 설정해서 여백의 비율을 조절해줄 수 있습니다.
*/

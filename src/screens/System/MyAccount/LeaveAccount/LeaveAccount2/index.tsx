import { View } from "react-native";
import Txt from "@components/atom/Txt";
import BG from "@components/atom/BG";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import AppBar from "@components/atom/AppBar";
import DiaICon from "@assets/svgs/Dia.svg"
import HeartIcon from "@assets/svgs/Heart.svg"
import LetterIcon from "@assets/svgs/Letter.svg"
import Button from "@components/atom/Button";
import { useState } from "react";

const LeaveAccount2Screen = () => {
    const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
    const [isConfirmed, setIsConfirmed] = useState(false);

    return (
        <BG type="solid">
            <AppBar title="회원 탈퇴" goBackCallbackFn={() => {navigation.goBack();}} />
                {/* 전체 컨테이너 */}
            <View className="flex-1 justify-between">
                {/* 상단 영역 */}
                <View>
                {/* 안내 문구 */}
                <View className="w-full px-px py-[42]">
                    <Txt type="title4" text={`N명의 청년들이\n닉네임님의 목소리를 들을 수 없게 돼요`} className="text-white" />
                    <View className="w-full flex-row mt-[21]">
                    <Txt type="title4" text={`정말 `} className="text-white" />
                    <Txt type="title4" text="내일모래" className="text-yellowPrimary" />
                    <Txt type="title4" text="를 떠나시겠어요?" className="text-white" />
                    </View>
                </View>
                {/* 구분선 */}
                <View className="w-full h-[5px] bg-blue600"/>
                {/* dataView 영역*/}
                <View className="w-full px-px pt-[42]">
                <View className="rounded-tl-[10px] rounded-tr-[10px] w-full bg-blue500 pt-[28] pb-[23] px-px">
                    <Txt type="body3" text={`닉네임님의 정보, 활동 내역 등\n소중한 기록이 모두 사라져요`} className="text-white" />
                    <View className="h-[11px]"/>
                    <Txt type="caption2" text={`탈퇴하면 다시 가입하더라도 이전 정보를 되돌릴 수 없어요`} className="text-gray300" />
                </View>

                <View className="rounded-bl-[10px] rounded-br-[10px] w-full bg-blue600 pt-[30] pb-[5] px-px">
                    {[
                        {icon: <DiaICon/>, text: "청년의 일상을 비추는 목소리"},
                        {icon: <View className="w-[22px] h-[22px]"><LetterIcon className="text-blue400"/></View>, text: "청년에게 받은 편지"},
                        {icon: <HeartIcon/>, text: "청년에게 받은 감사표현"}
                    ].map((item) => (
                        <View className="flex-row justify-between mb-[25px]">
                            <View className="flex-row items-center gap-[14px]">
                            {item.icon}
                            <Txt type="caption1" text={item.text} className="text-white" />
                            </View>
                            <Txt type="caption1" text="999개" className="text-yellowPrimary" />
                        </View>
                    ))}
                </View>
                
                </View>
                </View>
                {/* 버튼 영역 */}
                <View className="w-full mb-[55]">
                {/* 회원 탈퇴 확인완료 버튼 */}
                <View 
                    className="w-full px-px pt-[42] flex-row items-center justify-center gap-[10px] py-[18]"
                    onTouchEnd={() => setIsConfirmed(!isConfirmed)}
                >
                    {/* 체크박스 원 */}
                    <View className={`w-[20px] h-[20px] rounded-full ${isConfirmed ? 'bg-yellowPrimary' : 'bg-blue600'} justify-center items-center`}>
                        {isConfirmed && (
                            <View className="w-[6px] h-[10px] border-r-2 border-b-2 border-blue700 rotate-45" />
                        )}
                    </View>
                    {/* 텍스트 */}
                    <Txt type="body4" text="회원 탈퇴 유의사항을 확인했습니다" className="text-gray200" />
                </View>
                {/* 회원 탈퇴 버튼 */}
                <View className="w-full px-px">
                    <Button 
                        text="회원 탈퇴하고 계정 삭제하기" 
                        onPress={() => {}} 
                        disabled={!isConfirmed}
                    />
                </View>
                </View>
            </View>
        </BG>
    );
};

export default LeaveAccount2Screen;

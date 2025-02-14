import AppBar from "@components/atom/AppBar";
import BG from "@components/atom/BG";
import Txt from "@components/atom/Txt";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import { View, Pressable, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { LeaveReasons } from "@constants/LeaveReasons";
import { useState, useRef } from "react";
import Button from "@components/atom/Button";
import TextInput from "@components/molecule/ShadowTextInput";

const LeaveAccountScreen = () => {
    const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [detailReason, setDetailReason] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const toggleReason = (reason: string) => {
        setSelectedReasons(prev => 
            prev.includes(reason) 
                ? prev.filter(r => r !== reason)
                : [...prev, reason]
        );
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <BG type="solid">
                <AppBar title="회원 탈퇴" goBackCallbackFn={() => navigation.goBack()} />
                <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
                    {/* 전체 컨테이너 */}
                    <View className="flex-1 items-center">
                        {/* 안내 문구 */}
                        <View className="py-[41] px-px gap-[3] w-full">
                            <Txt type="title4" text="탈퇴하는 이유가 무엇인가요?" className="text-white" />
                            <Txt type="body4" text="더 나은 내일모래가 될 수 있도록 의견을 들려주세요" className="text-gray300" />
                        </View>
                        {/* 구분선 */}
                        <View className="w-full h-[5px] bg-blue600"></View>
                        {/* 이유 선택 컨테이너 */}
                        {LeaveReasons.map((reason, index) => (
                            <ReasonItem 
                                key={index} 
                                reason={reason} 
                                isSelected={selectedReasons.includes(reason)}
                                onPress={() => toggleReason(reason)}
                            />
                        ))}
                        <>
                            <ReasonItem 
                                reason="기타" 
                                isSelected={selectedReasons.includes("기타")}
                                onPress={() => toggleReason("기타")}
                            />
                            {selectedReasons.includes("기타") && (
                                <View className="w-full px-px">
                                <TextInput
                                    value={detailReason}
                                    onChangeText={setDetailReason}
                                    placeholder="내용을 입력해주세요"
                                    height={120}
                                />
                                </View>
                            )}
                        </>
                        <View className="w-full px-px mt-[29] mb-[55]">
                            <Button text="다음" onPress={() => {navigation.navigate("LeaveAccount2", {
                              reasons: selectedReasons,
                                otherReason: selectedReasons.includes("기타") ? detailReason : ""
                            })}} disabled={selectedReasons.length === 0 }/>
                        </View>
                    </View>
                </ScrollView>
            </BG>
        </KeyboardAvoidingView>
    );
};

export default LeaveAccountScreen;

const ReasonItem = ({
    reason,
    isSelected,
    onPress
}: {
    reason: string, 
    isSelected: boolean,
    onPress: () => void
}) => {
    return (
        <Pressable 
            onPress={onPress}
            className="flex-row gap-[21] items-center w-full px-px py-[32]"
        >
            <View className={`w-[20px] h-[20px] ${isSelected ? 'bg-yellowPrimary' : 'bg-blue500'} rounded-[5px] justify-center items-center`}>
              {isSelected && (
                <View className="w-[6px] h-[10px] border-r-2 border-b-2 border-blue700 rotate-45" />
              )}
            </View>
            <Txt type="body3" text={reason} className="text-white" />
        </Pressable>
    );
};

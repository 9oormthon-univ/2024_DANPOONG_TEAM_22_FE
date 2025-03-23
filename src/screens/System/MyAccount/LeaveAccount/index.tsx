import {AppBar} from "@components/AppBar";
import {BG} from "@components/BG";
import {CustomText} from "@components/CustomText";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import { View, Pressable, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useState } from "react";
import {Button} from "@components/Button";
import {TextInput} from "@components/TextInput";
const LeaveReasons = [
    "쓰지 않는 앱이에요",
    "개인정보가 걱정돼요", 
    "앱 사용법을 모르겠어요",
    "앱 사용성이 불편해요"
] as const;

export const LeaveAccountScreen = () => {
    const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [detailReason, setDetailReason] = useState('');

    const [isDetailTyping, setIsDetailTyping] = useState(false);

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
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {/* 전체 컨테이너 */}
                    <View className="flex-1 items-center">
                        {/* 안내 문구 */}
                        <View className="py-[41] px-px gap-[3] w-full">
                            <CustomText type="title4" text="탈퇴하는 이유가 무엇인가요?" className="text-white" />
                            <CustomText type="body4" text="더 나은 내일모래가 될 수 있도록 의견을 들려주세요" className="text-gray300" />
                        </View>
                        {/* 구분선 */}
                        <View className="w-full h-[5px] bg-blue600"/>
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
                                onPress={() => {toggleReason("기타"); setIsDetailTyping(true)}}
                            />
                            {selectedReasons.includes("기타") && (
                                <View className="w-full px-px" onTouchStart={() => {setIsDetailTyping(true)}}>
                                <TextInput  
                                    autoFocus
                                    value={detailReason}
                                    onChangeText={setDetailReason}
                                    placeholder="내용을 입력해주세요"
                                    isError={false}
                                    maxLength={160}
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
                {isDetailTyping && (
                    <View className="absolute top-0 right-0 h-full w-full z-[9]">
                        <BG type="solid">
                            <View className="mt-[64]"> 
                                <ReasonItem 
                                reason="기타" 
                                isSelected={selectedReasons.includes("기타")}
                                onPress={() => {toggleReason("기타"); setIsDetailTyping(false)}}
                            />
                                <View className="w-full px-px">
                                    <TextInput  
                                        autoFocus
                                        value={detailReason}
                                        onChangeText={setDetailReason}
                                        placeholder="내용을 입력해주세요"
                                        isError={false}
                                        maxLength={160}
                                />
                                </View>               
                             </View>
                             <View className="flex-1" onTouchStart={() => {setIsDetailTyping(false)}}/>
                        </BG>
                    </View>
                )}
            </BG>
        </KeyboardAvoidingView>
    );
};


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
            <CustomText type="body3" text={reason} className="text-white" />
        </Pressable>
    );
};

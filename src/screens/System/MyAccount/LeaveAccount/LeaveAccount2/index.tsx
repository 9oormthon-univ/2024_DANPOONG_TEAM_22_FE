import { View ,Dimensions} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
// apis
import { getMemberYouthNum } from "@apis/SystemApis/getMemberYouth-num";
import { deleteMember, DeleteMemberRequest } from "@apis/SystemApis/deleteMember";
import { getVoicefilesRetention, VoicefilesRetentionResponse } from "@apis/SystemApis/getVoicefilesRetention";
// utils
import { redirectToAuthScreen } from "@utils/redirectToAuthScreen";
// components
import {Text} from "@components/CostumText";
import {BG} from "@components/BG";
import {AppBar} from "@components/AppBar";
import {Button} from "@components/Button";
import {FlexableMargin} from "@components/FlexableMargin";
// assets
import DiaICon from "@assets/svgs/Dia.svg";
import HeartIcon from "@assets/svgs/Heart.svg";
import LetterIcon from "@assets/svgs/Letter.svg";




export const LeaveAccount2Screen = ({route}: {route: RouteProp<SystemStackParamList, 'LeaveAccount2'>}) => {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [youthMemberNum, setYouthMemberNum] = useState<number>(0);
    const {reasons, otherReason} = route.params;
    const [role, setRole] = useState('');
    const [nickname, setNickname] = useState('');
    const [voicefilesRetention, setVoicefilesRetention] = useState<VoicefilesRetentionResponse['result']>({
        voiceCount: 0,
        thanksCount: 0,
        messageCount: 0
    });
    
    // 회원 역할, 닉네임 조회, 음성 파일 보유 현황 조회
    useEffect(() => {
        (async () => {
            const storedRole = await AsyncStorage.getItem('role');
            const storedNickname = await AsyncStorage.getItem('nickname');
            if (storedRole) setRole(storedRole);
            if (storedNickname) setNickname(storedNickname);
        })();
        const fetchVoicefilesRetention = async () => {
            try {
                const retention = await getVoicefilesRetention();
                setVoicefilesRetention(retention);
            } catch (error) {
                if (__DEV__) console.error('청년 회원 수 조회 실패:', error);
            }
        };
        fetchVoicefilesRetention();
    }, []);
    // 청년 회원 수 조회
    useEffect(() => {
        const fetchYouthMemberNum = async () => {
            try {
                const num = await getMemberYouthNum();
                setYouthMemberNum(num);
            } catch (error) {
                if (__DEV__) {
                    console.error('청년 회원 수 조회 실패:', error);
                }
            }
        };
        if (role == 'HELPER') {
            fetchYouthMemberNum();
        }
    }, [role]);
  
    const handleDeleteMember = async () => {
        try {

            const data: DeleteMemberRequest = {
                reasonList: [...reasons, otherReason]
            };
            await deleteMember(data);
            await redirectToAuthScreen();
        } catch (error) {
            if (__DEV__) {
                console.error('회원 탈퇴 실패:', error);
            }
        }
    };
    
    return (
        <BG type="solid">
            <AppBar title="회원 탈퇴" goBackCallbackFn={() => {navigation.goBack();}}/>
            <View className="px-px" style={{height: windowHeight - 64}}>
                {/* 상단 영역 */}
                {role=='HELPER' ? (
                    <>
                    {/* 안내 문구 */}
                        <FlexableMargin flexGrow={42}/>
                        <CustomText type="title4" text={`${youthMemberNum}명의 청년들이\n${nickname}님의 목소리를 들을 수 없게 돼요`} className="text-white" />
                        <FlexableMargin flexGrow={21}/>
                        <View className="w-full flex-row">
                        <CustomText type="title4" text="정말" className="text-white" />
                        <CustomText type="title4" text="내일모래" className="text-yellowPrimary" />
                        <CustomText type="title4" text="를 떠나시겠어요?" className="text-white" />
                        </View>
                        <FlexableMargin flexGrow={42}/>
                    {/* 구분선 */}
                    <View className="h-[5] bg-blue600" style={{width: windowWidth, transform: [{translateX: -30}]}}/>
                    {/* dataView 영역*/}
                    <FlexableMargin flexGrow={42}/>
                    <View className="rounded-tl-[10px] rounded-tr-[10px] w-full bg-blue500 pt-[28] pb-[23] px-px">
                        <CustomText type="body3" text={`닉네임님의 정보, 활동 내역 등\n소중한 기록이 모두 사라져요`} className="text-white" />
                        <View className="h-[11px]"/>
                        <CustomText type="caption2" text={`탈퇴하면 다시 가입하더라도 이전 정보를 되돌릴 수 없어요`} className="text-gray300" />
                    </View>
                    <View className="rounded-bl-[10px] rounded-br-[10px] w-full bg-blue600 pt-[30] pb-[5] px-px">
                        {[
                            { icon: <DiaICon />, text: "청년의 일상을 비추는 목소리", count: voicefilesRetention.voiceCount },
                            { icon: <View className="w-[22px] h-[22px]"><LetterIcon className="text-blue400" /></View>, text: "청년에게 받은 편지", count: voicefilesRetention.messageCount },
                            { icon: <HeartIcon />, text: "청년에게 받은 감사표현", count: voicefilesRetention.thanksCount }
                        ].map((item, idx) => (
                            <View key={`${item.text}-${idx}`} className="flex-row justify-between mb-[25px]">
                                <View className="flex-row items-center gap-[14px]">
                                {item.icon}
                                <CustomText type="caption1" text={item.text} className="text-white" />
                                </View>
                                <CustomText type="caption1" text={`${item.count}개`} className="text-yellowPrimary" />
                            </View>
                        ))}
                    </View>
                    <FlexableMargin flexGrow={42}/>
                    </>
                    
                ) : (
                    <> 
                    <FlexableMargin flexGrow={42}/>
                    <View className="w-full flex-row mb-[20] gap-[0]">
                    <CustomText type="title4" text="정말 " className="text-white" />
                    <CustomText type="title4" text="내일모래" className="text-yellowPrimary" />
                    <CustomText type="title4" text="를 떠나시겠어요?" className="text-white" />
                    </View>
                    <CustomText type="body4" text={`계정 정보, 활동 내역 등 소중한 기록이 모두 사라져요\n탈퇴하면 다시 가입하더라도 이전 정보를 되돌릴 수 없어요`} className="text-gray300" />
                    <FlexableMargin flexGrow={479}/>
                    </>
                )}
                
                {/* 버튼 영역 */}
                <View className="w-full ">
                {/* 회원 탈퇴 확인완료 버튼 */}
                <View 
                    className="flex-row items-center justify-center py-[18] space-x-[10px]"
                    onTouchEnd={() => setIsConfirmed(!isConfirmed)}
                >
                    {/* 체크박스 원 */}
                    <View className={`w-[20px] h-[20px] rounded-full ${isConfirmed ? 'bg-yellowPrimary' : 'bg-blue600'} justify-center items-center`}>
                        {isConfirmed && (
                            <View className="w-[6px] h-[10px] border-r-2 border-b-2 border-blue700 rotate-45" />
                        )}
                    </View>
                    {/* 텍스트 */}
                    <CustomText type="body4" text="회원 탈퇴 유의사항을 확인했습니다" className="text-gray200" />
                </View>
                {/* 회원 탈퇴 버튼 */}
                <Button 
                        text="회원 탈퇴하고 계정 삭제하기" 
                        onPress={handleDeleteMember} 
                        disabled={!isConfirmed}
                />
                </View>
                <FlexableMargin flexGrow={55}/>

            </View>
        </BG>
    );
};


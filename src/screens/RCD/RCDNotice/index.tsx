// React Native 및 Navigation 관련 임포트
import {View, ScrollView} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
// 커스텀 컴포넌트 임포트
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import Button from '@components/atom/Button';

// SVG 아이콘 임포트
import Notice1 from '@assets/svgs/Notice1.svg';
import Notice2 from '@assets/svgs/Notice2.svg';
// 타입 임포트
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import AppBar from '@components/atom/AppBar';
import { RCDNoticeSectionConstant } from '@constants/RCDNoticeSectionConstant';
import { useState } from 'react';
import { getTopText } from '@apis/RCDApis/getTopText';
import { postAskGPT } from '@apis/RCDApis/postAskGPT';
import { postSaveScript } from '@apis/RCDApis/postVoicefilesAlarmIdSelf';

/**
 * 주의사항 섹션 컴포넌트
 * @param seq - 섹션 순서 번호
 * @param title - 섹션 제목
 * @param content - 섹션 내용
 */
const Section = ({
  seq,
  title,
  content,
}: {
  seq: number;
  title: string;
  content: string;
}) => {
  
  return (
    <View className="w-full h-auto mt-[37]">
      {seq === 0 ? <Notice1 /> : <Notice2 />}
      <View className="mt-[20]" />
      <Txt type="title4" text={title} className="text-yellowPrimary" />
      <View className="mt-[10]" />
      <Txt type="body4" text={content} className="text-gray200" />
    </View>
  );
};

/**
 * 녹음 전 주의사항 화면 컴포넌트
 * 녹음 시 유의해야 할 사항들을 안내하는 화면
 */
const RCDNoticeScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDNotice'>;
}) => {

  
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const {item, type} = route.params;
  const [isLoading, setIsLoading] = useState(false);
 
  const handleNavigate = async () => {
    if(type === 'INFO'){
      try{
        setIsLoading(true);
        const alarmId = (await getTopText(item.children[0])).alarmId;
        const script = (await postAskGPT(alarmId)).result.content;
        const voiceFileId = (await postSaveScript(alarmId, script)).result.voiceFileId;
        navigation.navigate('RCDRecord', {type, voiceFileId, content: script});
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }else{
      navigation.navigate('RCDSelectText', {type, item});
    }
  }

  return (
    <BG type="solid">
      {/* 상단 앱바 */}
      <AppBar
        title="주의 사항"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      
      <ScrollView
        className="flex-1 px-px mt-[64]"
      >
        <View className="flex-1 mb-[121]">
          {/* 헤더 섹션 */}
          <View className="mt-[63]" />
          <Txt
            type="title2"
            text={'녹음 전에,\n꼭 확인해주세요!'}
            className="text-white"
          />
          {/* 주의사항 섹션 */}
          {RCDNoticeSectionConstant.map((section, index) => (
            <Section
              key={index}
              seq={index}
              title={section.title}
              content={section.content}
            />
          ))}
        </View>
      </ScrollView>
      {/* 하단 버튼 섹션 */}
      <View className="absolute bottom-[53] w-full px-px">
        <Button
          text="확인했어요"
          onPress={handleNavigate}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </View>
    </BG>
  );
};

export default RCDNoticeScreen;

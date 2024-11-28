import {TextInput, TouchableOpacity, View} from 'react-native';
import BG from '@components/atom/BG';
import StarPNG from '@components/atom/StarPNG';
import Txt from '@components/atom/Txt';
import Button from '@components/atom/Button';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import ShadowView from '@components/atom/ShadowView';
import {useState, useRef, useEffect} from 'react';
import {HomeStackParamList} from '../../types/HomeStackParamList';
import {ScrollView} from 'react-native-gesture-handler';
import {postSaveScript} from '@apis/RCDApis/postSaveScript';
import Toast from '@components/atom/Toast';
import AppBar from '@components/atom/AppBar';
const RCDTextScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDText'>;
}) => {
  const {item, gptRes, alarmId, type} = route.params;
  const [text, setText] = useState('');
  const textInputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isToast, setIsToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setText(gptRes?.result.content || '');
  }, []);

  const onChangeText = (text: string) => {
    setText(text);
  };

  const scriptSubmitHandler = async () => {
    try {
      setIsLoading(true);
      // throw new Error('스크립트 저장 오류')
      //navigation.navigate('RCDRecord', { type, item, gptRes, alarmId,voiceFileId:10,content:text });
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const content: string = text;
      const res = await postSaveScript(alarmId, content);
      const voiceFileId = res.result.voiceFileId;
      navigation.navigate('RCDRecord', {
        type,
        item,
        gptRes,
        alarmId,
        voiceFileId,
        content,
      });
    } catch (e) {
      setIsError(true);
      setIsToast(true);
      console.log('스크립트 저장 오류:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BG type="solid">
      <AppBar
        title=""
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      <Toast
        text="부적절한 언어가 감지되어 녹음할 수 없어요"
        isToast={isToast}
        setIsToast={() => setIsToast(false)}
      />
      {/* frame */}
      <ScrollView
        className="w-full h-full px-px mt-[65] pt-[52]"
        contentContainerStyle={{alignItems: 'center'}}>
        {/* image section*/}
        <StarPNG />
        <View className="mb-[29]" />
        {/* header section*/}
        <View className="h-auto items-center mb-[50]">
          <Txt
            type="title2"
            text={item.title}
            className="text-white text-center"
          />
        </View>
        {/* text input section*/}
        <View
          className={`flex-1 w-full h-[340] mb-[51] rounded-card border-[1px] border-transparent ${
            isFocused && 'border-gray300'
          } ${isError && 'border-[#f13a1e] bg-error'}`}>
          <ShadowView>
            <TextInput
              ref={textInputRef}
              onChangeText={onChangeText}
              value={text}
              style={{
                fontFamily: 'WantedSans-Regular',
                fontSize: 20,
                lineHeight: 30,
                letterSpacing: 20 * -0.025,
                color: '#fafafa',
              }}
              className={'w-full h-auto p-[33]'}
              placeholder="15초 동안 녹음할 말을 작성해주세요"
              placeholderTextColor="#a0a0a0"
              autoCapitalize="none"
              cursorColor="#fafafa"
              multiline
              textAlign="left"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <TouchableOpacity
              onPress={() => {
                if (textInputRef.current) {
                  textInputRef.current.focus();
                }
              }}
              className="flex-1"
            />
          </ShadowView>
        </View>
        {/* button section*/}
        <View className="w-full mb-[78]">
          <Button
            text="녹음하기"
            onPress={scriptSubmitHandler}
            disabled={text.length === 0}
          />
        </View>
      </ScrollView>
    </BG>
  );
};
export default RCDTextScreen;

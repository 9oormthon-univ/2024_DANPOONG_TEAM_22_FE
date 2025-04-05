import {Linking,View} from 'react-native';

import {AppBar} from '@components/AppBar';
import {BG} from '@components/BG';
import {CustomText} from '@components/CustomText';
import {SystemButton} from '@components/SystemButton';
import { useAppVersion } from '@hooks/useAppVersion';
import type {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import type {SystemStackParamList} from '@type/nav/SystemStackParamList';

import {SERVICE_ITEMS} from './constants';

export const ServiceScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const {currentVersion, isUpdateAvailable, goToStore} = useAppVersion();

  const openWebsite = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('웹사이트를 여는데 실패했습니다:', error);
    }
  };

  return (
    <BG type="solid">
      <AppBar
        title="서비스"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
      />
      {/* 웹사이트 이동 버튼들 */}
      {SERVICE_ITEMS.map((item, index) => (
        <SystemButton
          key={index}
          title={item.title}
          onPress={() => openWebsite(item.url)}
          type="link"
        />
      ))}
      {/* 버전 정보 표시 영역 */}
      <View className="w-full flex-row justify-between items-center px-px py-[21]">
        {/* 텍스트 영역 */}
        <View className="flex-1">
          {/* 메뉴 제목 */}
          <View className="flex-row justify-start items-center gap-x-[11]">
            <CustomText
              type="body3"
              text={`현재 버전 ${currentVersion}`}
              className={isUpdateAvailable ? 'text-white' : 'text-gray300'}
            />
          </View>
        </View>
        <View
          className={`px-[17] py-[6] rounded-full ${
            isUpdateAvailable ? 'bg-yellowPrimary' : 'bg-gray300'
          }`}
          onTouchEnd={goToStore}>
          <CustomText
            type="caption1"
            text="업데이트"
            className={isUpdateAvailable ? 'text-black' : 'text-white'}
          />
        </View>
      </View>
    </BG>
  );
};


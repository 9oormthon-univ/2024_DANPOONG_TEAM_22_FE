import {AppBar} from '@components/AppBar';
import {BG} from '@components/BG';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '@react-navigation/native';
import {SystemStackParamList} from '@type/nav/SystemStackParamList';
import {SystemButton} from '@components/SystemButton';
import {View, Linking, Platform} from 'react-native';
import {CustomText} from '@components/CustomText';
import DeviceInfo from 'react-native-device-info';

export const ServiceScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();

  const currentVersion = DeviceInfo.getVersion();
  const latestVersion = '1.0.0';

  const isUpdateAvailable = currentVersion < latestVersion;

  const openWebsite = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('웹사이트를 여는데 실패했습니다:', error);
    }
  };
  const handleUpdate = async () => {
    if (!isUpdateAvailable) return;
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/[YOUR_APP_ID]', // 앱스토어 URL
      android: 'market://details?id=[YOUR_PACKAGE_NAME]', // 플레이스토어 URL
    });

    if (storeUrl) {
      try {
        await Linking.openURL(storeUrl);
      } catch (error) {
        console.error('스토어를 여는데 실패했습니다:', error);
      }
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
      {[
        {
          title: '내일모래 새소식',
          onPress: () => openWebsite('https://www.naeilmorae.co.kr'),
        },
        {
          title: '문의하기',
          onPress: () => openWebsite('https://www.naeilmorae.co.kr/contact'),
        },
        {
          title: '서비스 이용 약관',
          onPress: () => openWebsite('https://www.naeilmorae.co.kr/terms'),
        },
        {
          title: '개인정보 처리 방침',
          onPress: () => openWebsite('https://www.naeilmorae.co.kr/privacy'),
        },
      ].map((item, index) => (
        <SystemButton
          key={index}
          title={item.title}
          onPress={item.onPress}
          type="link"
        />
      ))}
      <View className="w-full flex-row justify-between items-center px-px py-[21]">
        {/* 텍스트 영역 */}
        <View className="flex-1">
          {/* 메뉴 제목 */}
          <View className="flex-row justify-start items-center gap-x-[11]">
            <CustomText              type="body3"
              text={`현재 버전 ${currentVersion}`}
              className={isUpdateAvailable ? 'text-white' : 'text-gray300'}
            />
          </View>
        </View>
        <View
          className={`px-[17] py-[6] rounded-full ${
            isUpdateAvailable ? 'bg-yellowPrimary' : 'bg-gray300'
          }`}
          onTouchEnd={handleUpdate}>
          <CustomText            type="caption1"
            text="업데이트"
            className={isUpdateAvailable ? 'text-black' : 'text-white'}
          />
        </View>
      </View>
    </BG>
  );
};


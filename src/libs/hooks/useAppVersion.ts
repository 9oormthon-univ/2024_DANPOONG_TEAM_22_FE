import {useEffect,useState} from 'react';
import {Linking,Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { getVersion } from '@apis/Version/get/fetch';

// 버전 관리를 위한 커스텀 훅
export const useAppVersion = () => {
    const [currentVersion, setCurrentVersion] = useState('');
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  
    useEffect(() => {
      (async () => {
        try {
          const latestVersion = await getVersion();
          const version = DeviceInfo.getVersion();

          setCurrentVersion(version);
          setIsUpdateAvailable(version !== latestVersion);

        } catch(error) {
          console.error('버전 가져오기 실패:', error);
        }
      })();
    }, []);
  
    const goToStore = async () => {
      if (!isUpdateAvailable) return;
      
      const storeUrl = Platform.select({
        ios: 'https://apps.apple.com/app/[YOUR_APP_ID]', // 앱스토어 URL
        android: 'market://details?id=com.jeong.naeilmorae', // 플레이스토어 URL
      });
  
      if (storeUrl) {
        try {
          await Linking.openURL(storeUrl);
        } catch (error) {
          console.error('스토어를 여는데 실패했습니다:', error);
        }
      }
    };
  
    return {
      currentVersion,
      isUpdateAvailable,
      goToStore,
  };
};

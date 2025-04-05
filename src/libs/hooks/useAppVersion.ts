import {useState, useEffect} from 'react';
import {Platform, Linking} from 'react-native';
import DeviceInfo from 'react-native-device-info';

// 버전 관리를 위한 커스텀 훅
export const useAppVersion = () => {
    const [currentVersion, setCurrentVersion] = useState('');
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
    const latestVersion = '1.0.0'; // API에서 가져오는 것으로 변경 가능
  
    useEffect(() => {
      const version = DeviceInfo.getVersion();
      setCurrentVersion(version);
      setIsUpdateAvailable(version !== latestVersion);
    }, []);
  
    const goToStore = async () => {
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
  
    return {
      currentVersion,
      isUpdateAvailable,
      goToStore,
  };
};

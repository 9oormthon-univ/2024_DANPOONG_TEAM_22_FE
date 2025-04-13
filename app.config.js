export const name = 'naeilmorae';

export default ({config}) => ({
  ...config,
  name: '내일모래',
  slug: 'naeilmorae',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo/app/app_logo_yellow.png',
  extra: {},
  splash: {
    image: './assets/images/logo/typo/typo_logo_white.png',
    resizeMode: 'contain',
    backgroundColor: '#252738',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/pngs/logo/NMLOGO.png',
      backgroundColor: '#252738',
    },
    package: 'com.jeong.naeilmorae',
    googleServicesFile: './google-services.json',
  },
  web: {
    favicon: './assets/pngs/logo/NMLOGO.png',
  },
  newArchEnabled: true,
  plugins: [
    [
      '@react-native-seoul/kakao-login',
      {
        kakaoAppKey: 'f75a34680c8df270b1e012834770bae4',
        kotlinVersion: '1.9.0',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: [
            'https://devrepo.kakao.com/nexus/content/groups/public/',
          ],
        },
      },
    ],
  ],
});

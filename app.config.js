export default ({config}) => ({
  ...config,
  name: '내일모래',
  slug: 'NM',
  owner: 'obb8923',
  // owner: 'bongjs',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo/app/app_logo_yellow.png',
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
    eas: {
      projectId: '78435b24-b21d-4edc-8b96-fa1e666218e7', // obb8923
      // projectId: '5fb90edd-f98c-44dd-a11e-3dd38dd2b57a', // bongjs
    },
  },
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
      foregroundImage: './assets/pngs/NMLOGO.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'com.nail.morae',
    googleServicesFile: './google-services.json',
  },
  web: {
    favicon: './assets/favicon.png',
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

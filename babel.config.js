//babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['nativewind/babel'],
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@components': './src/components',
            '@constants': './src/libs/constants',
            '@apis': './src/libs/apis',
            '@utils': './src/libs/utils',
            '@hooks': './src/libs/hooks',
            '@api': './src/api',
            '@stackNav': './src/nav/stackNav',
            '@tabNav': './src/nav/tabNav',
            '@screens': './src/screens',
            '@assets': './assets',
            '@type': './src/types',
            '@config': './src/config',
          },
        },
      ],
      ['react-native-reanimated/plugin'],
    ],
  };
};

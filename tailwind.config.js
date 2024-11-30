/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        b: 'WantedSans-Bold',
        sb: 'WantedSans-SemiBold',
        r: 'WantedSans-Regular',
        m: 'WantedSans-Medium',
      },
      textColor: {
        white: '#fafafa',
        black: '#121212',
        gray100: '#efefef',
        gray200: '#d0d0d0',
        gray300: '#a0a0a0',
        gray400: '#717171',
        gray500: '#333333',
        yellow100: '#fefee2',
        yellow200: '#fdfdc4',
        yellow300: '#fbfba7',
        yellow400: '#fafa89',
        yellowPrimary: '#f9f96c',
        yellow600: '#c7c756',
        recording: '#f13a1e',
      },
      backgroundColor: {
        gradient100: '#252738',
        gradient200: '#393c52',
        solid: '#252738',
        bottomNavigation: '#36384e',
        tabIcon: '#585a6c',
        mainPageBack100: '#121320',
        mainPageBack200: '#252738',
        gray100: '#efefef',
        gray200: '#d0d0d0',
        gray300: '#a0a0a0',
        gray400: '#717171',
        gray500: '#333333',
        yellowPrimary: '#f9f96c',
        error: '#f13a1e0d',
        white10: '#fafafa1a',
      },
      borderColor: {
        gray100: '#efefef',
        gray200: '#d0d0d0',
        gray300: '#a0a0a0',
        gray400: '#717171',
        gray500: '#333333',
        yellow200: '#fdfdc4',
        yellowPrimary: '#f9f96c',
        tabIcon: '#585a6c',
        red: '#f13a1e',
        white10: '#fafafa1a',
      },
      borderRadius: {
        btn: '16px',
        card: '10px',
      },
      padding: {
        btn: '13px',
        px: '30px',
        pt: '157px', // 상단에 appBar 가 없을때 padding Top 크기입니다.
        ptt: '63px', // 상단에 appBar 기 있을때 padding Top 크기입니다.
        pb: '55px',
      },
      margin: {
        mb: '55px',
      },
    },
  },
  plugins: [],
};

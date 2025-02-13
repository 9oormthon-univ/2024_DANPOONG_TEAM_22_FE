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
      colors: {
        // Yellow
        yellow100: '#fefee2',
        yellow200: '#fdfdc4',
        yellow300: '#fbfba7',
        yellow400: '#fafa89',
        yellowPrimary: '#f9f96c',
        yellow600: '#c7c756',

        // Blue
        blue100: '#D7D7DC',
        blue200: '#AFAFB8',
        blue300: '#868895',
        blue400: '#5E6071',
        blue500: '#36384E',
        blue600: '#2B2D3E',
        blue700: '#20222F',
        blue800: '#16161F',
        blue900: '#0B0B10',

        // Gray
        gray100: '#efefef',
        gray200: '#d0d0d0',
        gray300: '#a0a0a0',
        gray400: '#717171',
        gray500: '#414141',
        gray600: '#333333',

        white: '#fafafa',
        black: '#121212',
        red: '#f13a1e',

        // Gradient
        main100: '#16161F',
        main200: '#2B2D3E',
        second100: '#20222F',
        second200: '#36384E',

        // Transparent
        white10: '#fafafa1a',
        'yellow300/15': '#fbfba726',
      },
      borderRadius: {
        btn: '16px',
        card: '10px',
      },
      padding: {
        btn: '13px',
        px: '30px',
        pt: '157px',
        ptt: '63px',
        pb: '55px',
      },
      margin: {
        mb: '55px',
      },
    },
  },
  plugins: [],
};

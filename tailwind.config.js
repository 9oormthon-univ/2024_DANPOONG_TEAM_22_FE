/** @type {import('tailwindcss').Config} */
const colors = {
  white: '#fafafa',
  white10: '#fafafa1a',
  black: '#121212',
  gray: {
    100: '#efefef',
    200: '#d0d0d0',
    300: '#a0a0a0',
    400: '#717171',
    500: '#414141',
    600: '#333333',
  },
  blue: {
    100: '#d7d7dc',
    200: '#afafb8',
    300: '#868895',
    400: '#5e6071',
    500: '#36384e',
    600: '#2b2d3e',
    700: '#20222f',
    800: '#16161f',
    900: '#0b0b10',
  },
  yellow: {
    100: '#fefee2',
    200: '#fdfdc4',
    300: '#fbfba7',
    400: '#fafa89',
    primary: '#f9f96c',
    600: '#c7c756',
  },
  solid: '#20222f',
  red: '#f13a1e',
};

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
      colors,
      textColor: {
        ...colors,
        recording: colors.red,
      },
      backgroundColor: {
        ...colors,
        error: `${colors.red}0d`,
        bottomNavigation: colors.blue[500],
        tabIcon: colors.blue[400],
      },
      borderColor: {
        ...colors,
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

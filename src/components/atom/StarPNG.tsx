import {ImageBackground} from 'react-native';

const StarPNG = () => {
  return (
    <ImageBackground
      source={require('@assets/pngs/TopStar.png')}
      style={{width: 24, height: 24}}
    />
  );
};
export default StarPNG;

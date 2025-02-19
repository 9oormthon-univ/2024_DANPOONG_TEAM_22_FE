import {navigationRef} from 'App';

const navigateToYouthOnboardingScreen = () => {
  navigationRef.navigate('AuthStackNav', {
    screen: 'YouthOnboardingScreen',
  });
};

export default navigateToYouthOnboardingScreen;

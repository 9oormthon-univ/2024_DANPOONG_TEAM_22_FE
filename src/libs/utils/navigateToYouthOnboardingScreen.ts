import {navigationRef} from 'App';

export const navigateToYouthOnboardingScreen = () => {
  navigationRef.navigate('AuthStackNav', {
    screen: 'YouthOnboardingScreen',
  });
};

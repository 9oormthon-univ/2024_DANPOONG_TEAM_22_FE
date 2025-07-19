import { Linking } from 'react-native';

/** 설문조사 링크 */
const FORM_URL = 'https://forms.gle/QjaLkQXyHv8NCv2F6';

/** 설문조사 링크 이동 함수 */
export const goToForm = async () => {
  try {
    await Linking.openURL(FORM_URL);
  } catch (error) {
    console.error('설문조사 링크를 여는데 실패했습니다:', error);
  }
};

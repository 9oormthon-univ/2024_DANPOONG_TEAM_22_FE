import { deleteLogout } from "@apis/SystemApis/deleteLogout";
import { redirectToAuthScreen } from "./redirectToAuthScreen";
import { AxiosError } from "axios";

/**
 * 사용자 로그아웃 처리를 위한 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 로그아웃 API를 호출하고 인증 화면으로 리다이렉트합니다.
 * 오류 발생 시에도 적절한 처리를 수행합니다.
 * 
 * 입력:
 * 없음
 * 
 * 출력:
 * @returns {Promise<void>} - 비동기 작업 완료를 나타내는 Promise
 */
export const handleLogout = async () => {
   // API 로그아웃 호출
   try {
    await deleteLogout();     
    // 네비게이션 리셋과 토큰 제거 로직 호출
    redirectToAuthScreen();
   } catch (error) {
    // 401 또는 403 오류인 경우 로그인 화면으로 리다이렉트
    if(error instanceof AxiosError && (error.response?.status===401 || error.response?.status===403)){
      redirectToAuthScreen();
    }
    if(__DEV__) {
        console.error('로그아웃 실패:', error);
    }
   }
};
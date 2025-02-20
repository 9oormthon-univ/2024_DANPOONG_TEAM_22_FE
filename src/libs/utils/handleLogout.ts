import { deleteLogout } from "@apis/SystemApis/deleteLogout";
import { redirectToAuthScreen } from "./redirectToAuthScreen";
import { AxiosError } from "axios";
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
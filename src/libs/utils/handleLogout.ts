import { deleteLogout } from "@apis/SystemApis/deleteLogout";
import { redirectToAuthScreen } from "./redirectToAuthScreen";

export const handleLogout = async () => {
   // API 로그아웃 호출
   try {
    await deleteLogout();     
    // 네비게이션 리셋과 토큰 제거 로직 호출
    redirectToAuthScreen();
   } catch (error) {
    if(__DEV__) {
        console.error('로그아웃 실패:', error);
    }
   }
};
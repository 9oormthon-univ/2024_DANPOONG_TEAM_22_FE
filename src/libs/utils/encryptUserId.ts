import CryptoJS from 'crypto-js';

/**
 * 사용자 ID를 SHA256 해시로 암호화하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 사용자 ID를 SHA256 알고리즘을 사용하여 해시 처리합니다.
 * 사용자 식별은 가능하되 원본 ID는 보호하기 위한 용도로 사용됩니다.
 * 
 * 입력:
 * @param {string} userId - 암호화할 사용자 ID 문자열
 * 
 * 출력:
 * @returns {string} - SHA256으로 해시된 사용자 ID (16진수 문자열)
 */
export const encryptUserId = (userId: string) => {
  const hashedUserId = CryptoJS.SHA256(userId).toString(CryptoJS.enc.Hex);
  return hashedUserId;
};

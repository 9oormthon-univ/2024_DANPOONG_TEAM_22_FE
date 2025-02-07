import CryptoJS from 'crypto-js';

// SHA256으로 해시된 사용자 ID 반환
const encryptUserId = (userId: string) => {
  const hashedUserId = CryptoJS.SHA256(userId).toString(CryptoJS.enc.Hex);
  return hashedUserId;
};

export default encryptUserId;

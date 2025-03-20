/**
 * 모달 상태를 관리하는 훅
 * 
 * 설명:
 * 이 훅은 컴포넌트에서 모달의 표시 상태를 쉽게 관리할 수 있도록 해줍니다.
 * 모달의 열기, 닫기 기능을 제공하며 현재 모달의 표시 상태를 추적합니다.
 * 
 * 입력: 없음
 * 
 * 출력:
 * @returns {Object} 모달 상태 객체
 * @returns {boolean} visible - 현재 모달이 표시되고 있는지 여부
 * @returns {Function} openModal - 모달을 여는 함수
 * @returns {Function} closeModal - 모달을 닫는 함수
 */
import {useState} from 'react';

export const useModal = () => {
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  return {visible, openModal, closeModal};
};

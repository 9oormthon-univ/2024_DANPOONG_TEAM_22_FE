import {useState} from 'react';

export const useModal = () => {
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  return {visible, openModal, closeModal};
};


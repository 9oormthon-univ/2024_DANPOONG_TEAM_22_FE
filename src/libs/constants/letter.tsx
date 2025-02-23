import FightingIcon from '@assets/svgs/emotion/emotion_fighting.svg';
import FightingBlackIcon from '@assets/svgs/emotion/emotion_fighting_black.svg';
import LoveIcon from '@assets/svgs/emotion/emotion_love.svg';
import LoveBlackIcon from '@assets/svgs/emotion/emotion_love_black.svg';
import StarIcon from '@assets/svgs/emotion/emotion_star.svg';
import StarBlackIcon from '@assets/svgs/emotion/emotion_star_black.svg';
import ThumbIcon from '@assets/svgs/emotion/emotion_thumb.svg';
import ThumbBlackIcon from '@assets/svgs/emotion/emotion_thumb_black.svg';
import {EmotionType, LetterResponseData} from '@type/api/providedFile';
import {ReactNode} from 'react';

const currentDate = new Date().toISOString();

const LETTERS_DATA: LetterResponseData[] = [
  {
    providedFileId: 1,
    createdAt: currentDate,
    thanksMessage:
      '자립한 뒤로 지치고 외로웠는데 위로 한 마디가 제 삶을 움직일 동력이 되어줬어요. 감사합니다.',
    alarmType: '위로',
    member: {
      id: 0,
      name: '도토리',
      profileImage: '',
    },
  },
  {
    providedFileId: 2,
    createdAt: currentDate,
    thanksMessage: '요즘 많이 힘들었는데 덕분에 힘이 났어요. 정말 감사드려요!',
    alarmType: '기상',
    member: {
      id: 0,
      name: '고구마',
      profileImage: '',
    },
  },
  {
    providedFileId: 3,
    createdAt: currentDate,
    thanksMessage:
      '일 하느라 바쁜 일상이었는데 덕분에 힘 내서 할 수 있었어요. 감사해요.',
    alarmType: '식사',
    member: {
      id: 0,
      name: '붕어빵',
      profileImage: '',
    },
  },
  {
    providedFileId: 4,
    createdAt: currentDate,
    thanksMessage: '요새 많이 힘들었는데 덕분에 힘이 나요. 정말 감사합니다.',
    alarmType: '우울',
    member: {
      id: 0,
      name: '팥붕',
      profileImage: '',
    },
  },
  {
    providedFileId: 5,
    createdAt: currentDate,
    thanksMessage:
      '요즘 정신적으로 많이 힘들었는데 덕분에 힘이 났어요. 정말 감사드려요!',
    alarmType: '위로',
    member: {
      id: 0,
      name: '슈붕',
      profileImage: '',
    },
  },
  {
    providedFileId: 6,
    createdAt: currentDate,
    thanksMessage:
      '요새 잠을 많이 못 자서 체력적으로 많이 지치고 힘들었는데 덕분에 힘이 나요. 정말 감사합니다.',
    alarmType: '취침',
    member: {
      id: 0,
      name: '고슴도치',
      profileImage: '',
    },
  },
  {
    providedFileId: 7,
    createdAt: currentDate,
    thanksMessage:
      '많이 우울하고 저만 뒤처지는 느낌이 들었는데 덕분에 힘을 낼 수 있었어요. 정말 감사합니다.',
    alarmType: '외출',
    member: {
      id: 0,
      name: '고라니',
      profileImage: '',
    },
  },
  {
    providedFileId: 8,
    createdAt: currentDate,
    thanksMessage:
      '위로의 말이 듣고 싶었어요. 덕분에 마음이 편해졌어요. 정말 감사합니다.',
    alarmType: '위로',
    member: {
      id: 0,
      name: '북극곰',
      profileImage: '',
    },
  },
  {
    providedFileId: 9,
    createdAt: currentDate,
    thanksMessage:
      '위로가 됐어요. 감사합니다 덕분에 힘이 나요. 정말 감사합니다.',
    alarmType: '위로',
    member: {
      id: 0,
      name: '호두',
      profileImage: '',
    },
  },
  {
    providedFileId: 10,
    createdAt: currentDate,
    thanksMessage: '걱정이 많았는데 덕분에 안심이 됐어요 감사합니다.',
    alarmType: '칭찬',
    member: {
      id: 0,
      name: '땅콩',
      profileImage: '',
    },
  },
  {
    providedFileId: 11,
    createdAt: currentDate,
    thanksMessage: '감사합니다. 덕분에 힘이 나요. 정말 감사합니다.',
    alarmType: '칭찬',
    member: {
      id: 0,
      name: '초코파이',
      profileImage: '',
    },
  },
  {
    providedFileId: 12,
    createdAt: currentDate,
    thanksMessage: '힘이 되는 말씀 너무 감사합니다!',
    alarmType: '외출',
    member: {
      id: 0,
      name: '초코파이',
      profileImage: '',
    },
  },
  {
    providedFileId: 13,
    createdAt: currentDate,
    thanksMessage: '위로해주셔서 감사해요! 덕분에 마음에 편해졌어요.',
    alarmType: '위로',
    member: {
      id: 0,
      name: '호떡',
      profileImage: '',
    },
  },
  {
    providedFileId: 14,
    createdAt: currentDate,
    thanksMessage: '마음이 한결 편해졌어요. 정말 감사드립니다.',
    alarmType: '위로',
    member: {
      id: 0,
      name: '블루베리',
      profileImage: '',
    },
  },
];

export const EMOTION_OPTIONS: {
  icon: ReactNode;
  label: string;
  type: EmotionType;
}[] = [
  {icon: <StarIcon />, label: '감사해요', type: 'THANK_YOU'},
  {icon: <ThumbIcon />, label: '도움돼요', type: 'HELPFUL'},
  {icon: <FightingIcon />, label: '힘낼게요', type: 'MOTIVATED'},
  {icon: <LoveIcon />, label: '사랑해요', type: 'LOVE'},
];

export const EMOTION_OPTIONS_YOUTH: {
  icon: ReactNode;
  label: string;
  type: EmotionType;
}[] = [
  {icon: <StarBlackIcon />, label: '감사해요', type: 'THANK_YOU'},
  {icon: <ThumbBlackIcon />, label: '도움돼요', type: 'HELPFUL'},
  {icon: <FightingBlackIcon />, label: '힘낼게요', type: 'MOTIVATED'},
  {icon: <LoveBlackIcon />, label: '사랑해요', type: 'LOVE'},
];

export {LETTERS_DATA};

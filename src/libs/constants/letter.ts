import {LetterResponseData} from '@type/api/providedFile';

const currentDate = new Date().toISOString();

const LETTERS_DATA: LetterResponseData[] = [
  {
    providedFileId: 1,
    createdAt: currentDate,
    thanksMessage:
      '자립한 뒤로 지치고 외로웠는데 바람돌이님의 위로 한 마디가 제 삶을 움직일 동력이 되어줬어요. 감사합니다.',
    alarmType: '위로',
  },
  {
    providedFileId: 2,
    createdAt: currentDate,
    thanksMessage: '요즘 많이 힘들었는데 덕분에 힘이 났어요. 정말 감사드려요!',
    alarmType: '기상',
  },
  {
    providedFileId: 3,
    createdAt: currentDate,
    thanksMessage:
      '일 하느라 바쁜 일상이었는데 덕분에 힘 내서 할 수 있었어요. 감사해요.',
    alarmType: '식사',
  },
];

export {LETTERS_DATA};

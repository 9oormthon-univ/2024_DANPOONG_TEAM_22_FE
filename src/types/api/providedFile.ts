import {FileMemberResponseData} from '@type/api/member';

type AlarmType = '외출' | '기상' | '식사' | '취침' | '위로' | '우울' | '칭찬';

type EmotionType = 'THANK_YOU' | 'HELPFUL' | 'MOTIVATED' | 'LOVE';

type CommentRequestData = {
  providedFileId: number;
  message: string;
};

type ReportRequestData = {
  providedFileId: number;
  reason: string;
};

type SummaryResponseData = {
  totalListeners: number;
  reactionsNum: {
    THANK_YOU: number;
    HELPFUL: number;
    MOTIVATED: number;
    LOVE: number;
  };
};

type LettersRequestData = {
  parentCategory?: string;
  pageable: {
    page: number;
    size: number;
    sort: string;
  };
};

type LetterResponseData = {
  providedFileId: number;
  createdAt: string;
  thanksMessage: string;
  alarmType: AlarmType;
  member: FileMemberResponseData;
};

type LettersResponseData = {
  content: LetterResponseData[];
  totalPages: number;
  number: number;
};

export type {
  AlarmType,
  CommentRequestData,
  EmotionType,
  LetterResponseData,
  LettersRequestData,
  LettersResponseData,
  ReportRequestData,
  SummaryResponseData,
};

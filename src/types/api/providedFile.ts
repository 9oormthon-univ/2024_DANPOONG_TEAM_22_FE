type AlarmType = '외출' | '기상' | '식사' | '취침' | '위로' | '우울' | '칭찬';

type CommentRequestData = {
  providedFileId: number;
  message: string;
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
  parentCategoryId?: number;
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
};

type LettersResponseData = {
  content: LetterResponseData[];
};

export type {
  AlarmType,
  CommentRequestData,
  SummaryResponseData,
  LettersRequestData,
  LetterResponseData,
  LettersResponseData,
};

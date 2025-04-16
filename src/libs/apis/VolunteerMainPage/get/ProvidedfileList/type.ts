type AlarmType = '외출' | '기상' | '식사' | '취침' | '위로' | '우울' | '칭찬';

export type getProvidedfileListRequest = {
  parentCategory?: string;
  pageable: {
    page: number;
    size: number;
    sort: string;
  };
};

type FileMemberResponseData = {
  id: number;
  name: string;
  profileImage: string;
};

export type LetterResponseData = {
  providedFileId: number;
  createdAt: string;
  thanksMessage: string;
  alarmType: AlarmType;
  member: FileMemberResponseData;
};
export type getProvidedfileListResponse = {
  content: LetterResponseData[];
  totalPages: number;
  number: number;
};

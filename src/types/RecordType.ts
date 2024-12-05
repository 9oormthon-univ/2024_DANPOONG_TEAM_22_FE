import { RecordTypeConstant } from '@constants/RecordType';

export type RecordType = typeof RecordTypeConstant[keyof typeof RecordTypeConstant];

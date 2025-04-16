import { type ResultResponseData } from '@type/api/common';

export type getMemberInfoHelperResponse = ResultResponseData<{
  thankYouMessage: boolean;
  welcomeReminder: boolean;
}>;

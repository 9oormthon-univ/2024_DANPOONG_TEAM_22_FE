import { client } from '@apis/client';
import { type PostVoiceFilesReportByVoiceFileIdRequest } from '@apis/YouthListenToVoice/post/VoiceFilesReportByVoiceFileId/type';
import { type ResultResponseData } from '@type/api/common';

export const postVoiceFilesReportByVoiceFileId = async ({
  voiceFileId,
  reason,
}: PostVoiceFilesReportByVoiceFileIdRequest) => {
  const res = await client.post<ResultResponseData<boolean>>(
    `/api/v1/${voiceFileId}/report`,
    {
      reason,
    },
  );

  return res.data;
};

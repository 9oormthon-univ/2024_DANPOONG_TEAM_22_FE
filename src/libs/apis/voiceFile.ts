import client from '@apis/client';
import {ResultResponseData} from '@type/api/common';
import {
  VoiceFileResponseData,
  VoiceFilesRequestData,
} from '@type/api/voiceFile';

const getVoiceFiles = async ({alarmId}: Readonly<VoiceFilesRequestData>) => {
  const res = await client.get<ResultResponseData<VoiceFileResponseData>>(
    `/api/v1/voicefiles?alarm-id=${alarmId}`,
  );
  return res.data;
};

export {getVoiceFiles};

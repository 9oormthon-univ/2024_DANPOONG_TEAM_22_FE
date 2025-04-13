import {getVoiceFilesWithAlarmId} from '@apis/YouthListenToVoice/get/VoiceFilesWithAlarmId/fetch';
import {useQuery} from '@tanstack/react-query';
import {VoiceFilesRequestData} from '@type/api/voiceFile';

export const useGetVoiceFiles = ({alarmId}: Readonly<VoiceFilesRequestData>) => {
  return useQuery({
    queryKey: ['getVoiceFiles', alarmId],
    queryFn: () => getVoiceFilesWithAlarmId({alarmId}),
    enabled: !!alarmId,
  });
};


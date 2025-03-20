import {getVoiceFiles} from '@apis/voiceFile';
import {useQuery} from '@tanstack/react-query';
import {VoiceFilesRequestData} from '@type/api/voiceFile';

export const useGetVoiceFiles = ({alarmId}: Readonly<VoiceFilesRequestData>) => {
  return useQuery({
    queryKey: ['getVoiceFiles', alarmId],
    queryFn: () => getVoiceFiles({alarmId}),
    enabled: !!alarmId,
  });
};


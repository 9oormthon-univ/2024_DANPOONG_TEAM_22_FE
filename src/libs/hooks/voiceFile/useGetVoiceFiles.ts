import {getVoiceFiles} from '@apis/voiceFile';
import {useQuery} from '@tanstack/react-query';
import {VoiceFilesRequestData} from '@type/voiceFile';

const useGetVoiceFiles = ({alarmId}: Readonly<VoiceFilesRequestData>) => {
  return useQuery({
    queryKey: ['getVoiceFiles', alarmId],
    queryFn: () => getVoiceFiles({alarmId}),
    enabled: !!alarmId,
  });
};

export default useGetVoiceFiles;

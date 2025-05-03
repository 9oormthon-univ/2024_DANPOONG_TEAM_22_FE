import { postVoiceFilesReportByVoiceFileId } from '@apis/YouthListenToVoice/post/VoiceFilesReportByVoiceFileId/post';
import { type PostVoiceFilesReportByVoiceFileIdRequest } from '@apis/YouthListenToVoice/post/VoiceFilesReportByVoiceFileId/type';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

export const usePostVoiceFilesReportByVoiceFileIdQuery = (
  options?: Omit<
    UseMutationOptions<
      unknown,
      Error,
      PostVoiceFilesReportByVoiceFileIdRequest
    >,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: data => postVoiceFilesReportByVoiceFileId(data),
    ...options,
  });
};

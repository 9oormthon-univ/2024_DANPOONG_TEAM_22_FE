import { deleteProvidedfileCommentByProvidedFileId } from '@apis/YouthListenToVoice/delete/ProvidedfileCommentByProvidedFileId/fetch';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { type CommentRequestData } from '@type/api/providedFile';

export const useDeleteComment = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: (data: CommentRequestData) =>
      deleteProvidedfileCommentByProvidedFileId(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['getComment'] }),
    onError: error => console.log(error),
  });
};

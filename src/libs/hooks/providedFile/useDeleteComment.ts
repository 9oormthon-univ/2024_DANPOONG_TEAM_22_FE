import {deleteComment} from '@apis/providedFile';
import {QueryClient, useMutation} from '@tanstack/react-query';
import {CommentRequestData} from '@type/api/providedFile';

const useDeleteComment = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: CommentRequestData) => deleteComment(data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['getComment']}),
    onError: error => console.log(error),
  });
};

export default useDeleteComment;

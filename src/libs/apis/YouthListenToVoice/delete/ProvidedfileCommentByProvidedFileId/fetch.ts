import { client } from "@apis/client";
import { ResultResponseData } from "@type/api/common";
import { CommentRequestData } from "./type";

export const deleteProvidedfileCommentByProvidedFileId = async ({
    providedFileId,
    message,
  }: Readonly<CommentRequestData>) => {
    const res = await client.delete<ResultResponseData<boolean>>(
      `/api/v1/providedfile/${providedFileId}/comment`,
      {
        data: {message},
      },
    );
    return res.data;
  };
  
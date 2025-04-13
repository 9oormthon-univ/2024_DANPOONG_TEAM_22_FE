import { client } from "@apis/client";
import { ResultResponseData } from "@type/api/common";
import { CommentRequestData } from "./type";

export const postProvidedfileCommentByProvidedFileId = async ({
    providedFileId,
    message,
  }: Readonly<CommentRequestData>) => {
    const res = await client.post<ResultResponseData<boolean>>(
      `/api/v1/providedfile/${providedFileId}/comment`,
      {
        message,
      },
    );
    return res.data;
  };
  
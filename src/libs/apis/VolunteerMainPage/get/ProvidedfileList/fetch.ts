import { client } from "@apis/client";
import { ResultResponseData } from "@type/api/common";
import { getProvidedfileListRequest, getProvidedfileListResponse } from "./type";

export const getProvidedfileList = async ({
    parentCategory,
    pageable,
  }: Readonly<getProvidedfileListRequest>) => {
    const res = await client.get<ResultResponseData<getProvidedfileListResponse>>(
      parentCategory
        ? `/api/v1/providedfile/list?parentCategory=${parentCategory}&page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`
        : `/api/v1/providedfile/list?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`,
    );
    return res.data;
  };
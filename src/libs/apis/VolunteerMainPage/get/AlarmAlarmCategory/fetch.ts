import { client } from "@apis/client";
import { ResultResponseData } from "@type/api/common";
import { getAlarmAlarmCategoryResponse } from "./type";
export const getAlarmAlarmCategory = async (): Promise<ResultResponseData<getAlarmAlarmCategoryResponse>> => {
    const res = await client.get<ResultResponseData<getAlarmAlarmCategoryResponse>>(
      '/api/v1/alarm/alarm-category/',
    );
    return res.data;
  };
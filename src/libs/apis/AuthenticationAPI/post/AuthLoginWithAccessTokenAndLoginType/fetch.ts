import {postAuthLoginWithAccessTokenAndLoginTypeRequest, postAuthLoginWithAccessTokenAndLoginTypeResponse} from './type';
import {ResultResponseData} from '@type/api/common';
import axios from 'axios';
import Config from 'react-native-config';

export const postAuthLoginWithAccessTokenAndLoginType = async ({
  accessToken,
  loginType,
}: Readonly<postAuthLoginWithAccessTokenAndLoginTypeRequest>) => {
  const res = await axios.post<ResultResponseData<postAuthLoginWithAccessTokenAndLoginTypeResponse>>(
    `${Config.API_URL}/api/v1/auth/login?accessToken=${accessToken}&loginType=${loginType}`,
  );
  return res.data;
};
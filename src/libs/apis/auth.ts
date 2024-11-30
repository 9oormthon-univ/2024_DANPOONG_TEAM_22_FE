import {LoginRequestData, LoginResponseData} from '@type/api/auth';
import {ResultResponseData} from '@type/api/common';
import axios from 'axios';

const postLogin = async ({
  accessToken,
  loginType,
}: Readonly<LoginRequestData>) => {
  const res = await axios.post<ResultResponseData<LoginResponseData>>(
    `${'http://nysams.com:8081'}/api/v1/auth/login?accessToken=${accessToken}&loginType=${loginType}`,
  );
  return res.data;
};

export {postLogin};

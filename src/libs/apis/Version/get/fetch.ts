import { client } from '@apis/client';

export const getVersion = async (): Promise<string> => {
  const res = await client.get<string>('/api/v1/version');

  return res.data;
};

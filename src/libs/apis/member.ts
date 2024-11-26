import client from '@apis/client'
import { ResultResponseData } from '@type/common'
import {
  HelperNumResponseData,
  MemberInfoResponseData,
  MemberRequestData,
  MemberResponseData,
} from '@type/member'

const getHelperNum = async () => {
  const res = await client.get<ResultResponseData<HelperNumResponseData>>(
    `/api/v1/member/helper-num`
  )
  return res.data
}

const postMember = async ({
  name,
  gender,
  profileImage,
  role,
  birth,
}: Readonly<MemberRequestData>) => {
  const res = await client.post<ResultResponseData<MemberResponseData>>(
    `/api/v1/member`,
    {
      name,
      gender,
      profileImage,
      role,
      birth,
    }
  )
  return res.data
}

const getMember = async () => {
  const res =
    await client.get<ResultResponseData<MemberInfoResponseData>>(
      `/api/v1/member`
    )
  return res.data
}

export { getHelperNum, postMember, getMember }

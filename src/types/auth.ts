type LoginRequestData = {
  accessToken: string
  loginType: string
}

type LoginResponseData = {
  memberId: number
  accessToken: string
  refreshToken: string
  serviceMember: boolean
}

export type { LoginRequestData, LoginResponseData }

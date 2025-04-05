export type ResultResponseData<T> = {
  code: {
    httpStatus: string
    code: string
    message: string
    success: boolean
  }
  result: T
}
export type Gender = 'MALE' | 'FEMALE';
export type Role = 'ADMIN' | 'YOUTH' | 'HELPER' | 'GUEST';
export type AlarmType = 'DAILY' | 'COMFORT' | 'INFO';

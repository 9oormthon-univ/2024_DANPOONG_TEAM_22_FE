type ResultResponseData<T> = {
  code: {
    httpStatus: string
    code: string
    message: string
    success: boolean
  }
  result: T
}

export type { ResultResponseData }

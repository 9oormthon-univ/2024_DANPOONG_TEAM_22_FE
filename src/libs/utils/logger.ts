/**
 * HTTP 요청 정보를 콘솔에 로깅하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 API 요청 정보를 포맷팅하여 콘솔에 출력합니다.
 * 
 * 입력:
 * @param {any} config - HTTP 요청 설정 객체 (URL, 메서드, 헤더, 데이터 포함)
 * 
 * 출력:
 * @returns {void} - 반환값 없음, 콘솔에 로그 출력
 */
export const logRequest = (config) => {
  console.log(
    'Request:',
    JSON.stringify(
      {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      },
      null,
      2,
    ),
  );
};

/**
 * HTTP 응답 정보를 콘솔에 로깅하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 API 응답 정보를 포맷팅하여 콘솔에 출력합니다.
 * 
 * 입력:
 * @param {any} response - HTTP 응답 객체 (URL, 상태 코드, 응답 데이터 포함)
 * 
 * 출력:
 * @returns {void} - 반환값 없음, 콘솔에 로그 출력
 */
export const logResponse = (response) => {
  console.log(
    'Response:',
    JSON.stringify(
      {
        url: response.config.url,
        status: response.status,
        data: response.data,
      },
      null,
      2,
    ),
  );
};

/**
 * HTTP 응답 오류 정보를 콘솔에 로깅하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 API 응답 오류 정보를 포맷팅하여 콘솔에 출력합니다.
 * 
 * 입력:
 * @param {any} error - HTTP 오류 객체 (URL, 오류 상태 코드, 오류 데이터 포함)
 * 
 * 출력:
 * @returns {void} - 반환값 없음, 콘솔에 로그 출력
 */
export const logResponseError = (error) => {
  console.log(
    'Response Error:',
    JSON.stringify(
      {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data,
      },
      null,
      2,
    ),
  );
};

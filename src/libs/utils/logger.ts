export const logRequest = (config: any) => {
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

export const logResponse = (response: any) => {
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

export const logResponseError = (error: any) => {
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

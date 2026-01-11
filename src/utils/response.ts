// 회원가입 성공 응답
export const signupSuccess = (userid: string, userName: string) => {
  return {
    success: true,
    userid,
    userName,
    error: null
  };
};

// 에러 응답
export const apiError = (code: number, message: string, field?: string) => {
  return {
    success: false,
    error: {
      code: code.toString(),
      message,
      ...(field && { field })
    }
  };
};

// 성공 응답
export const success = <T>(data: T, message: string = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

// 에러 응답
export const error = (message: string, details?: any) => {
  return {
    success: false,
    error: {
      message,
      details
    }
  };
};

// 페이지네이션 응답
export const paginated = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) => {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
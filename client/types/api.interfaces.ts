export interface IErrorResponse {
  message: any;
  error: {
    status?: number;
    message: string;
    fields?: {
      [field: string]: {
        message: string;
        code: string;
      };
    };
  };
}

export const LIMIT_MESSAGES_PER_API_CALL = 25;

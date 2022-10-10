export interface IErrorResponse {
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

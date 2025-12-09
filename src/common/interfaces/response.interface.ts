export enum ResponseStatus {
  SUCCESS = 'Success',
  FAIL = 'Fail'
}

export interface ApiResponse<T = any> {
  data: T;
  status: ResponseStatus;
  message?: string;
}

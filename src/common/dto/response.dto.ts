export class ApiResponses<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;

  constructor(partial: Partial<ApiResponses<T>>) {
    Object.assign(this, partial);
  }

  static success<T>(message: string, data?: T): ApiResponses<T> {
    return new ApiResponses<T>({
      success: true,
      message,
      data
    });
  }

  static error<T>(message: string, error?: string): ApiResponses<T> {
    return new ApiResponses<T>({
      success: false,
      message,
      error
    });
  }
}

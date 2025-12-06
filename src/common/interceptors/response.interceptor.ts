import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, ResponseStatus } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the response is already in the ApiResponse format, return it as is
        if (data && typeof data === 'object' && 'status' in data && 'data' in data) {
          return data as ApiResponse<T>;
        }

        // Otherwise, wrap the response in the standard format
        return {
          data: data || null,
          status: ResponseStatus.SUCCESS
        };
      })
    );
  }
}

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';

export interface SerializeOptions {
    dto: ClassConstructor<any>;
}

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor<any>) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                // If data is null or undefined, return as is
                if (!data) {
                    return data;
                }

                // Handle already formatted responses
                if (data && typeof data === 'object' && 'status' in data && 'data' in data) {
                    // Transform the nested data property
                    const transformedData = plainToInstance(this.dto, data.data, {
                        excludeExtraneousValues: true,
                        enableImplicitConversion: true,
                    });

                    return {
                        ...data,
                        data: transformedData,
                    };
                }

                // Transform regular data
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true,
                });
            }),
        );
    }
}

// Decorator to easily apply serialization to routes
export function Serialize(dto: ClassConstructor<any>) {
    return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
        // This will be used as a method decorator
        if (descriptor) {
            // Method decorator
            return descriptor;
        }
        // Class decorator - we'll apply it via interceptor
        return target;
    };
}

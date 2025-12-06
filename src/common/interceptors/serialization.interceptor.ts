import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';

/**
 * Custom Serialization Interceptor
 * Transforms response data using class-transformer
 */
export class SerializationInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor<any>) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}

/**
 * Decorator to apply serialization to a route or controller
 * Usage: @Serialize(UserDto)
 */
export function Serialize(dto: ClassConstructor<any>) {
    return UseInterceptors(new SerializationInterceptor(dto));
}

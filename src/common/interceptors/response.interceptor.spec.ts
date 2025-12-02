import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';
import { ResponseStatus } from '../interfaces/response.interface';

describe('ResponseInterceptor', () => {
    let interceptor: ResponseInterceptor<any>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ResponseInterceptor],
        }).compile();

        interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);
    });

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    describe('intercept', () => {
        const mockExecutionContext = {} as ExecutionContext;

        it('should wrap plain data in ApiResponse format', (done) => {
            const plainData = { name: 'John Doe', age: 30 };
            const mockCallHandler: CallHandler = {
                handle: () => of(plainData),
            };

            interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
                next: (result) => {
                    expect(result).toEqual({
                        data: plainData,
                        status: ResponseStatus.SUCCESS,
                    });
                    done();
                },
            });
        });

        it('should pass through data already in ApiResponse format', (done) => {
            const apiResponseData = {
                data: { name: 'John Doe' },
                status: ResponseStatus.SUCCESS,
                message: 'Success message',
            };
            const mockCallHandler: CallHandler = {
                handle: () => of(apiResponseData),
            };

            interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
                next: (result) => {
                    expect(result).toEqual(apiResponseData);
                    done();
                },
            });
        });

        it('should handle null data', (done) => {
            const mockCallHandler: CallHandler = {
                handle: () => of(null),
            };

            interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
                next: (result) => {
                    expect(result).toEqual({
                        data: null,
                        status: ResponseStatus.SUCCESS,
                    });
                    done();
                },
            });
        });

        it('should handle undefined data', (done) => {
            const mockCallHandler: CallHandler = {
                handle: () => of(undefined),
            };

            interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
                next: (result) => {
                    expect(result).toEqual({
                        data: null,
                        status: ResponseStatus.SUCCESS,
                    });
                    done();
                },
            });
        });

        it('should wrap array data in ApiResponse format', (done) => {
            const arrayData = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ];
            const mockCallHandler: CallHandler = {
                handle: () => of(arrayData),
            };

            interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
                next: (result) => {
                    expect(result).toEqual({
                        data: arrayData,
                        status: ResponseStatus.SUCCESS,
                    });
                    done();
                },
            });
        });

        it('should handle ApiResponse with Fail status', (done) => {
            const failResponse = {
                data: null,
                status: ResponseStatus.FAIL,
                message: 'Operation failed',
            };
            const mockCallHandler: CallHandler = {
                handle: () => of(failResponse),
            };

            interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
                next: (result) => {
                    expect(result).toEqual(failResponse);
                    done();
                },
            });
        });
    });
});

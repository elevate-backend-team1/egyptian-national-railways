import { HttpException, BadRequestException } from '@nestjs/common';

export function handleServiceError(error: unknown): never {
  // If it's already an HTTP exception, just throw it
  if (error instanceof HttpException) {
    throw error;
  }

  // If it's a standard Error, extract the message
  if (error instanceof Error) {
    throw new BadRequestException(error.message);
  }

  // For anything else, convert to string
  throw new BadRequestException(String(error));
}

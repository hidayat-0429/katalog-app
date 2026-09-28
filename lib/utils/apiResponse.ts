import { NextResponse } from 'next/server';

/**
 * Standardized API response types
 */
export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a successful API response
 * @param data - The data to return
 * @param status - HTTP status code (default: 200)
 * @param headers - Additional headers
 * @returns NextResponse with standardized success format
 */
export function apiSuccess<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status, headers }
  );
}

/**
 * Create an error API response
 * @param error - The error message
 * @param status - HTTP status code (default: 500)
 * @param code - Optional error code
 * @param headers - Additional headers
 * @returns NextResponse with standardized error format
 */
export function apiError(
  error: string,
  status: number = 500,
  code?: string,
  headers?: Record<string, string>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { success: false, error, ...(code && { code }) },
    { status, headers }
  );
}

/**
 * Common API error responses
 */
export const ApiErrors = {
  unauthorized: (message: string = 'Unauthorized', headers?: Record<string, string>) =>
    apiError(message, 401, 'UNAUTHORIZED', headers),
  
  forbidden: (message: string = 'Forbidden', headers?: Record<string, string>) =>
    apiError(message, 403, 'FORBIDDEN', headers),
  
  notFound: (message: string = 'Not found', headers?: Record<string, string>) =>
    apiError(message, 404, 'NOT_FOUND', headers),
  
  badRequest: (message: string = 'Bad request', headers?: Record<string, string>) =>
    apiError(message, 400, 'BAD_REQUEST', headers),
  
  internal: (message: string = 'Internal server error', headers?: Record<string, string>) =>
    apiError(message, 500, 'INTERNAL_ERROR', headers),
};

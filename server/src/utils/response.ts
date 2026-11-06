import { Response } from 'express';
import { ApiResponse } from '../core/types/api.types.js';

export class ResponseHelper {
  public static success<T>(
    res: Response,
    data: T,
    meta?: ApiResponse<T>['meta'],
    statusCode: number = 200
  ): Response {
    const payload: ApiResponse<T> = {
      success: true,
      data,
      ...(meta ? { meta } : {})
    };
    return res.status(statusCode).json(payload);
  }

  public static created<T>(
    res: Response,
    data: T,
    meta?: ApiResponse<T>['meta']
  ): Response {
    return this.success(res, data, meta, 201);
  }
}

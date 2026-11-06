export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IJob<TData = unknown, TResult = unknown> {
  id: string;
  tenantId?: string;
  type: string;
  status: JobStatus;
  progress: number;
  data: TData;
  result?: TResult;
  error?: string;
  attempts: number;
  maxAttempts: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

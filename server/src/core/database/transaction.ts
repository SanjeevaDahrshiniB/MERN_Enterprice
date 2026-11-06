import mongoose, { ClientSession } from 'mongoose';
import { logger } from '../logger/logger.js';

export interface TransactionOptions {
  maxCommitTimeMS?: number;
}

/**
 * Executes a callback within a MongoDB multi-document ACID transaction.
 * Automatically handles session lifecycle (start, commit, abort, end).
 * If running on a standalone local MongoDB without replica set, it gracefully
 * falls back to executing the callback without a transaction so local development
 * does not crash.
 */
export async function withTransaction<T>(
  operation: (session: ClientSession | null) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  let session: ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction(options);

    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error: any) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortErr) {
        logger.error('Failed to abort transaction', { error: abortErr });
      }
    }

    // Check if error is due to MongoDB running as a standalone node without replica set
    const isStandaloneError =
      error.message?.includes('replica set') ||
      error.message?.includes('Transaction numbers are only allowed') ||
      error.codeName === 'TransactionNumbers' ||
      error.code === 20;

    if (isStandaloneError) {
      logger.warn(
        'MongoDB is running in standalone mode (no replica set). Executing operation without transaction.'
      );
      return operation(null);
    }

    throw error;
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}

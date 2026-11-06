import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContext } from '../types/api.types.js';

class TenantContextManager {
  private readonly storage = new AsyncLocalStorage<RequestContext>();

  public run<R>(context: RequestContext, callback: () => R): R {
    return this.storage.run(context, callback);
  }

  public getContext(): RequestContext | undefined {
    return this.storage.getStore();
  }

  public getTenantId(): string {
    const context = this.storage.getStore();
    if (!context?.tenantId) {
      throw new Error('Tenant context missing: tenantId was not found in active request context');
    }
    return context.tenantId;
  }

  public getUserId(): string | undefined {
    return this.storage.getStore()?.userId;
  }

  public getRequestId(): string {
    return this.storage.getStore()?.requestId ?? 'unknown_req';
  }
}

export const tenantContext = new TenantContextManager();

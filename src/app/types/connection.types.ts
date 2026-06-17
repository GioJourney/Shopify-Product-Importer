import type { IssueDescriptor } from './issue.types';

export interface ConnectionTestResult {
  ok: boolean;
  shopName?: string;
  shopDomain?: string;
  scopes?: string[];
  error?: IssueDescriptor | string;
}

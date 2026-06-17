/** Parameters interpolated into a localized issue message (keyed by placeholder). */
export type IssueParams = Record<string, string | number>;

/**
 * A code-tagged issue. The renderer translates `code` (+ `params`) into localized
 * text; `message` is the human-readable fallback shared with the Electron backend.
 */
export interface IssueDescriptor {
  code?: string | null;
  params?: IssueParams | null;
  message: string;
}

/** A validation issue tied to a specific spreadsheet row/field. */
export interface ImportIssue extends IssueDescriptor {
  rowNumber?: number;
  field?: string;
}

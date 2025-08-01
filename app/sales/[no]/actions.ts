'use server'

import { submitForApproval, ApprovalResult } from '@/lib/api'

/**
 * Sends a sales document for approval.
 *
 * @param no – The sales document number (required)
 * @param etag – The @odata.etag for concurrency control (optional)
 * @returns The Business Central action result
 */
export async function sendForApproval(
  no: string,
  etag?: string
): Promise<ApprovalResult> {
  // Forward both arguments in the correct order:
  return submitForApproval(no, etag)
}
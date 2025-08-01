'use client'

import React, { useState } from 'react'
import { sendForApproval } from './actions'

interface ApproveButtonProps {
  no: string
  etag?: string
}

export default function ApproveButton({ no, etag }: ApproveButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    setError(undefined)

    try {
      const result = await sendForApproval(no, etag)
      // TODO: inspect `result` and show confirmation message if needed
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit for approval')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleClick}
        disabled={loading || success}
        className="px-4 py-2 bg-blue-600 text-white disabled:opacity-50 rounded"
      >
        {loading
          ? 'Submitting…'
          : success
          ? 'Submitted'
          : 'Send for Approval'}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
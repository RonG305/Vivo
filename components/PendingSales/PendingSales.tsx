'use client'

import React, { useState } from "react"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react/dist/iconify.js"
import { VivoSalesHeader } from "@/types"

import {
  submitForApproval,
  returnBackToOpen,
  approveRequest,
  rejectRequest,
} from "@/lib/api"

interface Props {
  data: VivoSalesHeader[]
}

export function PendingSalesList({ data }: Props) {
  const [viewSaleNo, setViewSaleNo] = useState<string | null>(null)
  const [saleToApprove, setSaleToApprove] =
    useState<VivoSalesHeader | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // comment dialog state
  const [openComment, setOpenComment] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [commentError, setCommentError] = useState<string | null>(null)
  const [commentLoading, setCommentLoading] = useState(false)

  const router = useRouter()

  // === existing handlers ===

  const handleConfirm = async () => {
    if (!saleToApprove) return
    setActionLoading(true)
    try {
      await submitForApproval(
        saleToApprove.No,
        saleToApprove["@odata.etag"]
      )
      setSaleToApprove(null)
      router.refresh()
    } catch (err) {
      console.error("Approval error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReturn = async () => {
    if (!viewSaleNo) return
    setActionLoading(true)
    try {
      await returnBackToOpen(viewSaleNo)
      setViewSaleNo(null)
      router.refresh()
    } catch (err) {
      console.error("ReturnBackToOpen error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!viewSaleNo) return
    setActionLoading(true)
    try {
      await approveRequest(viewSaleNo)
      setViewSaleNo(null)
      router.refresh()
    } catch (err) {
      console.error("ApproveRequest error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!viewSaleNo) return
    setActionLoading(true)
    try {
      await rejectRequest(viewSaleNo)
      setViewSaleNo(null)
      router.refresh()
    } catch (err) {
      console.error("RejectRequest error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // === comment dialog handlers ===

  const openCommentDialog = () => {
    setCommentText("")
    setCommentError(null)
    setOpenComment(true)
  }
  const closeCommentDialog = () => {
    setCommentError(null)
    setOpenComment(false)
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      setCommentError("Please enter a reason or comment.")
      return
    }
    setCommentLoading(true)
    setCommentError(null)
    try {
      // TODO: wire up your API call here, e.g.
      // await commentOnPendingSale(viewSaleNo!, commentText.trim())
      console.log("Submitting comment for", viewSaleNo, commentText)
      closeCommentDialog()
      router.refresh()
    } catch (err: any) {
      console.error("Comment error:", err)
      setCommentError(err.message || "Failed to submit comment.")
    } finally {
      setCommentLoading(false)
    }
  }

  // === render ===

  if (data.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center text-muted">No pending sales found.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Pending Sales</h2>

      <Card className="bg-transparent">
        <Table>
          <TableCaption>
            Outlet: {data[0]?.Outlet_Name || "–"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Target</TableHead>
              <TableHead className="text-right">Achieved</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((sale) => (
              <TableRow key={sale.No}>
                <TableCell className="font-medium">
                  <Button
                    variant="link"
                    onClick={() => setViewSaleNo(sale.No)}
                  >
                    {sale.No}
                  </Button>
                </TableCell>
                <TableCell>{sale.Outlet_Name}</TableCell>
                <TableCell>{sale.Region_Name}</TableCell>
                <TableCell>{sale.Date_Captured}</TableCell>
                <TableCell>{sale.Time_Captured}</TableCell>
                <TableCell className="text-right">
                  {sale.Total_Target.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {sale.Total_Achieved.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {sale.Total_Commission_Earned.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={sale.Status === "Open" ? "secondary" : "destructive"}
                  >
                    {sale.Status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => setSaleToApprove(sale)}
                  >
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Totals</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Card>

      {/* Confirm–Approve Dialog */}
      <Dialog
        open={!!saleToApprove}
        onOpenChange={(o) => !o && setSaleToApprove(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Approve sale No: {saleToApprove?.No}?
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setSaleToApprove(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Approving…" : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-screen Pending Sales Card */}
      <Dialog
        open={!!viewSaleNo}
        onOpenChange={(o) => !o && setViewSaleNo(null)}
      >
        <DialogContent
          className="
            w-full
            sm:w-[80vw] sm:max-w-5xl
            max-h-[90vh]
            overflow-auto
            p-6
          "
        >
          <DialogHeader>
            <DialogTitle>Pending Sales Card</DialogTitle>
          </DialogHeader>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              variant="outline"
              disabled={actionLoading}
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to Return Back to Open?"
                  )
                ) {
                  handleReturn()
                }
              }}
            >
              <Icon icon="mdi:undo" className="mr-2" />
              Return To Open
            </Button>

            <Button
              variant="default"
              disabled={actionLoading}
              onClick={() => {
                if (window.confirm("Are you sure you want to Approve")) {
                  handleApprove()
                }
              }}
            >
              <Icon icon="mdi:check" className="mr-2" />
              Approve
            </Button>

            <Button
              variant="destructive"
              disabled={actionLoading}
              onClick={() => {
                if (window.confirm("Are you sure you wanna Reject ?")) {
                  handleReject()
                }
              }}
            >
              <Icon icon="mdi:close" className="mr-2" />
              Reject
            </Button>

            {/* New Comment action */}
            <Button
              variant="outline"
              disabled={actionLoading}
              onClick={openCommentDialog}
            >
              <Icon icon="mdi:comment-text-outline" className="mr-2" />
              Comment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog
        open={openComment}
        onOpenChange={(o) => !o && closeCommentDialog()}
      >
        <DialogContent className="sm:max-w-md max-w-full p-6">
          <DialogHeader>
            <DialogTitle>Add Comment for No: {viewSaleNo}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex flex-col">
              <Label htmlFor="comment">Reason / Comment</Label>
              <Textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                placeholder="Enter reason or comment"
                disabled={commentLoading}
              />
              {commentError && (
                <p className="text-destructive text-sm mt-1">
                  {commentError}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={closeCommentDialog}
              disabled={commentLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitComment}
              disabled={commentLoading}
            >
              {commentLoading ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
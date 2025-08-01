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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { API_BASE_URL, API_AUTHORIZATION } from "@/lib/constants"
import { VivoSalesHeader } from "@/types"

interface Props {
  data: VivoSalesHeader[]
}

export function PendingSalesList({ data }: Props) {
  const [saleToApprove, setSaleToApprove] = useState<VivoSalesHeader | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleConfirm = async () => {
    if (!saleToApprove) return
    setIsLoading(true)
    try {
      const res = await fetch(
        `${API_BASE_URL}/SendRequestForApproval`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: API_AUTHORIZATION,
          },
          body: JSON.stringify({
            Code: saleToApprove.No,
            "@odata.etag": saleToApprove["@odata.etag"],
          }),
        }
      )
      if (!res.ok) {
        console.error("Approval failed:", await res.text())
        throw new Error("Approval error")
      }
      setSaleToApprove(null)
      router.refresh()
    } catch (err) {
      console.error("Approval error:", err)
    } finally {
      setIsLoading(false)
    }
  }

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
                <TableCell className="font-medium">{sale.No}</TableCell>
                <TableCell>{sale.Outlet_Name}</TableCell>
                <TableCell>{sale.Region_Name}</TableCell>
                <TableCell>{sale.Date_Captured}</TableCell>
                <TableCell>{sale.Time_Captured}</TableCell>
                <TableCell className="text-right">{sale.Total_Target}</TableCell>
                <TableCell className="text-right">{sale.Total_Achieved}</TableCell>
                <TableCell className="text-right">{sale.Total_Commission_Earned}</TableCell>
                <TableCell>
                  <Badge variant={sale.Status === "Open" ? "secondary" : "destructive"}>
                    {sale.Status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => setSaleToApprove(sale)}>
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

      <Dialog
        open={!!saleToApprove}
        onOpenChange={(open) => !open && setSaleToApprove(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve sale No: {saleToApprove?.No}?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Approving…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
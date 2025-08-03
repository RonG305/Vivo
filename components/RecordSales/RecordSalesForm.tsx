// components/RecordSales/RecordSalesForm.tsx

'use client'

import React, { useEffect, useState, FormEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table'
import { API_AUTHORIZATION, API_BASE_URL } from '@/lib/constants'
import { submitForApproval } from '@/lib/api'
import { VivoProduct, ProductSKU } from '@/types'

interface SalesLine {
  No: string
  SN: number
  Officer_Name: string
  Role_Name: string
  Product_Code?: string
  Target: number
  SKU_Code?: string
  SKU_Liters: number
  Grade: string
  Quantity: number
  Total: number
  SKU_Ratio: number
  Commission_Earned: number
  '@odata.etag': string
  isUpdating: boolean
}

type Toast = {
  type: 'success' | 'error'
  message: string
}

interface RecordSalesFormProps {
  No: string
  header: {
    Region_Name: string
    Region_Code: string
    Outlet_Name: string
    Outlet_Code: string
  }
  onClose: () => void
}

export default function RecordSalesForm({
  No,
  header,
  onClose,
}: RecordSalesFormProps) {
  const [lineItems, setLineItems] = useState<SalesLine[]>([])
  const [products, setProducts] = useState<VivoProduct[]>([])
  const [SKU, setSKU] = useState<ProductSKU[]>([])
  const [toast, setToast] = useState<Toast | null>(null)
  const [isApproving, setIsApproving] = useState(false)

  // Auto-dismiss toast after 3s
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  // Low-level PATCH helper
  async function patchLine(
    no: string,
    sn: number,
    payload: Partial<SalesLine>,
    etag: string
  ) {
    const url = `${API_BASE_URL}/NewSalesLines(No='${no}',SN=${sn})`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_AUTHORIZATION,
        'If-Match': etag,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(`HTTP ${res.status}: ${txt}`)
    }
    return res.json()
  }

  // Per-row updater
  async function handlePatch(
    idx: number,
    payload: Partial<SalesLine>,
    field: string
  ) {
    // set updating flag
    setLineItems(rows =>
      rows.map((r, i) => (i === idx ? { ...r, isUpdating: true } : r))
    )

    const row = lineItems[idx]
    try {
      const updated = await patchLine(
        row.No,
        row.SN,
        payload,
        row['@odata.etag']
      )
      setLineItems(rows =>
        rows.map((r, i) =>
          i === idx
            ? {
                ...r,
                ...updated,
                '@odata.etag': updated['@odata.etag'],
                isUpdating: false,
              }
            : r
        )
      )
      setToast({ type: 'success', message: `${field} updated` })
    } catch (err: any) {
      console.error(err)
      setLineItems(rows =>
        rows.map((r, i) => (i === idx ? { ...r, isUpdating: false } : r))
      )
      setToast({ type: 'error', message: `Failed to update ${field}` })
    }
  }

  // Field-specific handlers
  const handleProductChange = (i: number, code: string) =>
    handlePatch(i, { Product_Code: code }, 'Product')
  const handleSKUChange = (i: number, code: string) =>
    handlePatch(i, { SKU_Code: code }, 'SKU')
  const handleQuantityChange = (i: number, qty: number) =>
    handlePatch(i, { Quantity: qty }, 'Quantity')

  // Load line items on mount / No change
  useEffect(() => {
    if (!No) return
    fetch(`${API_BASE_URL}/NewSalesLines?$filter=No eq '${No}'`, {
      headers: { Authorization: API_AUTHORIZATION },
    })
      .then(r => r.json())
      .then(d =>
        setLineItems(
          (d.value || []).map((row: any) => ({ ...row, isUpdating: false }))
        )
      )
      .catch(console.error)
  }, [No])

  // Load lookup data once
  useEffect(() => {
    fetch(`${API_BASE_URL}/vivoproducts`, {
      headers: { Authorization: API_AUTHORIZATION },
    })
      .then(r => r.json())
      .then(d => setProducts(d.value || []))
      .catch(console.error)

    fetch(`${API_BASE_URL}/LubricantSKUs`, {
      headers: { Authorization: API_AUTHORIZATION },
    })
      .then(r => r.json())
      .then(d => setSKU(d.value || []))
      .catch(console.error)
  }, [])

  // Prevent form submit on Enter
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  // Send for approval
  const handleSendForApproval = async () => {
    setIsApproving(true)
    setToast(null)

    try {
      await submitForApproval(No)
      setToast({ type: 'success', message: 'Sent for approval' })
      onClose()
    } catch (err: any) {
      console.error(err)
      setToast({ type: 'error', message: err.message || 'Approval failed' })
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <Dialog open={!!No} onOpenChange={open => !open && onClose()}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <DialogContent className="sm:max-w-fit max-h-[98vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Sale No: {No}</DialogTitle>
            <DialogDescription>
              Review or adjust line items, then send for approval.
            </DialogDescription>
          </DialogHeader>

          {/* Toast / Confirmation Banner */}
          {toast && (
            <div
              className={`mx-4 mt-4 p-3 rounded border text-sm ${
                toast.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {toast.message}
            </div>
          )}

          {/* Header info + Actions */}
          <div className="bg-white border-b px-4 py-4 sticky top-[3.5rem] z-20 flex justify-between">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="uppercase">Sale No</Label>
                <Input readOnly defaultValue={No} className="mt-2" />
              </div>
              <div>
                <Label className="uppercase">Region</Label>
                <Input
                  readOnly
                  defaultValue={header.Region_Name}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="uppercase">Region Code</Label>
                <Input
                  readOnly
                  defaultValue={header.Region_Code}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="uppercase">Outlet</Label>
                <Input
                  readOnly
                  defaultValue={header.Outlet_Name}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="uppercase">Outlet Code</Label>
                <Input
                  readOnly
                  defaultValue={header.Outlet_Code}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSendForApproval}
                disabled={isApproving}
              >
                {isApproving ? 'Sending…' : 'Send for Approval'}
              </Button>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <Card className="bg-transparent p-4">
              <Table className="w-full">
                <TableCaption>Individual Sales Targets</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Target (Ltrs)</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>SKU (Ltrs)</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total (Ltrs)</TableHead>
                    <TableHead>SKU Ratio</TableHead>
                    <TableHead>Commission Earned</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, idx) => (
                    <TableRow
                      key={`${item.No}-${item.SN}`}
                      className="even:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        {item.Officer_Name}
                      </TableCell>
                      <TableCell>{item.Role_Name}</TableCell>
                      <TableCell>
                        <select
                          className="w-full border rounded px-2 py-1"
                          disabled={item.isUpdating}
                          value={item.Product_Code ?? ''}
                          onChange={e =>
                            handleProductChange(idx, e.target.value)
                          }
                        >
                          <option value="">Select Product</option>
                          {products.map(p => (
                            <option key={p.Code} value={p.Code}>
                              {p.Description}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <p className="text-right">{item.Target.toFixed(2)}</p>
                      </TableCell>
                      <TableCell>
                        <select
                          className="w-full border rounded px-2 py-1"
                          disabled={item.isUpdating}
                          value={item.SKU_Code ?? ''}
                          onChange={e => handleSKUChange(idx, e.target.value)}
                        >
                          <option value="">Select SKU</option>
                          {SKU.map(s => (
                            <option key={s.SKU_Code} value={s.SKU_Code}>
                              {s.SKU_Name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <p className="text-right">
                          {item.SKU_Liters.toFixed(3)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-right">{item.Grade}</p>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-[80px] text-right"
                          disabled={item.isUpdating}
                          value={item.Quantity}
                          onChange={e =>
                            handleQuantityChange(idx, Number(e.target.value))
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <p className="text-right">
                          {item.Total.toFixed(3)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-right">
                          {item.SKU_Ratio.toFixed(3)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-right">
                          {item.Commission_Earned.toFixed(2)}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.isUpdating ? (
                          <Icon
                            icon="solar:spinner-loop-bold"
                            className="animate-spin text-xl"
                          />
                        ) : (
                          <div className="flex justify-center space-x-2">
                            <Button variant="outline" size="sm">
                              +
                            </Button>
                            <Button variant="destructive" size="sm">
                              ×
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
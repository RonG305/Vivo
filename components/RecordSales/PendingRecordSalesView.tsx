// components/RecordSales/PendingRecordSalesView.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { API_BASE_URL, API_AUTHORIZATION } from '@/lib/constants'
import { submitForApproval } from '@/lib/api'
import { VivoProduct, ProductSKU, VivoSalesHeader } from '@/types'

interface Props {
  No: string
}

export default function PendingRecordsSalesView({ No }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)

  const [header, setHeader] = useState<VivoSalesHeader | null>(null)
  const [lineItems, setLineItems] = useState<any[]>([])
  const [products, setProducts] = useState<VivoProduct[]>([])
  const [skus, setSkus] = useState<ProductSKU[]>([])
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // 1. Fetch header when dialog opens
  useEffect(() => {
    if (!No || !open) return
    fetch(
      `${API_BASE_URL}/NewOpenSalesList_2?$filter=No eq '${No}'`,
      { headers: { Authorization: API_AUTHORIZATION } }
    )
      .then(r => r.json())
      .then(d => setHeader(d.value?.[0] || null))
      .catch(err => console.error('Header fetch error:', err))
  }, [No, open])

  // 2. Fetch line items when dialog opens
  useEffect(() => {
    if (!No || !open) return
    fetch(
      `${API_BASE_URL}/NewSalesLines?$filter=No eq '${No}'`,
      { headers: { Authorization: API_AUTHORIZATION } }
    )
      .then(r => r.json())
      .then(d => setLineItems(d.value || []))
      .catch(err => console.error('Lines fetch error:', err))
  }, [No, open])

  // 3. Fetch product master
  useEffect(() => {
    fetch(`${API_BASE_URL}/vivoproducts`, {
      headers: { Authorization: API_AUTHORIZATION },
    })
      .then(r => r.json())
      .then(d => setProducts(d.value || []))
      .catch(err => console.error('Products fetch error:', err))
  }, [])

  // 4. Fetch SKU master
  useEffect(() => {
    fetch(`${API_BASE_URL}/LubricantSKUs`, {
      headers: { Authorization: API_AUTHORIZATION },
    })
      .then(r => r.json())
      .then(d => setSkus(d.value || []))
      .catch(err => console.error('SKUs fetch error:', err))
  }, [])

  /**
   * Generic PATCH helper that retries once on 409 conflict.
   */
  async function patchLine(
    no: string,
    sn: number,
    body: Record<string, any>,
    etag: string,
    retry = true
  ) {
    const res = await fetch(
      `${API_BASE_URL}/NewSalesLines(No='${no}',SN=${sn})`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_AUTHORIZATION,
          'If-Match': etag,
        },
        body: JSON.stringify(body),
      }
    )

    if (res.status === 409 && retry) {
      // Re-fetch fresh ETag for this row
      const fresh = await fetch(
        `${API_BASE_URL}/NewSalesLines(No='${no}',SN=${sn})?$select=@odata.etag`,
        { headers: { Authorization: API_AUTHORIZATION } }
      )
      const freshJson = await fresh.json()
      const freshEtag = freshJson['@odata.etag']
      // Retry exactly once
      return patchLine(no, sn, body, freshEtag, false)
    }

    if (!res.ok) {
      throw new Error(`PATCH failed: ${res.status}`)
    }
    return res.json()
  }

  // Handlers for product, SKU, quantity
  const handleProductChange = async (idx: number, code: string) => {
    const row = lineItems[idx]
    if (!row) return
    try {
      const updated = await patchLine(
        row.No,
        row.SN,
        { Product_Code: code },
        row['@odata.etag']
      )
      setLineItems(prev =>
        prev.map((r, i) =>
          i === idx
            ? {
                ...r,
                Product_Code: code,
                Target: updated.Target,
                '@odata.etag': updated['@odata.etag'],
              }
            : r
        )
      )
    } catch (e) {
      console.error('Product PATCH error:', e)
    }
  }

  const handleSKUChange = async (idx: number, code: string) => {
    const row = lineItems[idx]
    if (!row) return
    try {
      const updated = await patchLine(
        row.No,
        row.SN,
        { SKU_Code: code },
        row['@odata.etag']
      )
      setLineItems(prev =>
        prev.map((r, i) =>
          i === idx
            ? {
                ...r,
                SKU_Code: code,
                SKU_Liters: updated.SKU_Liters,
                Grade: updated.SKU_Grade,
                Total: updated.Total,
                Quantity: updated.Quantity,
                '@odata.etag': updated['@odata.etag'],
              }
            : r
        )
      )
    } catch (e) {
      console.error('SKU PATCH error:', e)
    }
  }

  const handleQuantityChange = async (idx: number, qty: number) => {
    const row = lineItems[idx]
    if (!row) return
    try {
      const updated = await patchLine(
        row.No,
        row.SN,
        { Quantity: qty },
        row['@odata.etag']
      )
      setLineItems(prev =>
        prev.map((r, i) =>
          i === idx
            ? {
                ...r,
                Quantity: updated.Quantity,
                Total: updated.Total,
                SKU_Ratio: updated.SKU_Ratio,
                Commission_Earned: updated.Commission_Earned,
                '@odata.etag': updated['@odata.etag'],
              }
            : r
        )
      )
    } catch (e) {
      console.error('Quantity PATCH error:', e)
    }
  }

  // Create a new blank line
  const createNewLine = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/NewSalesLines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_AUTHORIZATION,
        },
        body: JSON.stringify({ No }),
      })
      if (!res.ok) throw new Error(`POST failed: ${res.status}`)
      const data = await res.json()
      setLineItems(prev => [...prev, ...data.value])
    } catch (e) {
      console.error('Create line error:', e)
    }
  }

  // Delete an existing line
  const deleteLine = async (no: string, sn: number) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE_URL}/NewSalesLines(No='${no}',SN=${sn})`,
        { method: 'DELETE', headers: { Authorization: API_AUTHORIZATION } }
      )
      if (!res.ok) throw new Error(`DELETE failed: ${res.status}`)
      setLineItems(prev => prev.filter(r => !(r.No === no && r.SN === sn)))
    } catch (e) {
      console.error('Delete line error:', e)
    } finally {
      setLoading(false)
    }
  }

  // Submit header for approval
  const handleSubmitForApproval = async () => {
    if (!header) return
    setLoading(true)
    setMessage('')

    try {
      await submitForApproval(No, header['@odata.etag'])
      setMessage('✅ Submitted for approval')
      setHeader(h => (h ? { ...h, Status: 'Pending Approval' } : h))

      setTimeout(() => {
        onClose()
        router.refresh()
      }, 800)
    } catch (e: any) {
      console.error('Approval error:', e)
      setMessage('❌ Failed to submit for approval')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" onClick={() => setOpen(true)}>
          {No}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[95vw] max-h-[95vh] p-0 flex flex-col overflow-hidden">
        {message && (
          <div
            className={`p-4 ${
              message.startsWith('✅')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle>Record Sales #{No}</DialogTitle>
          <DialogDescription>
            Review and adjust individual lines.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white border-b px-4 py-4 sticky top-0 z-20 flex justify-between items-start flex-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <Label className="uppercase text-xs text-gray-600">
                Captured By
              </Label>
              <Input defaultValue={No} readOnly className="mt-1" />
            </div>
            <div className="flex flex-col">
              <Label className="uppercase text-xs text-gray-600">
                Region
              </Label>
              <Input
                defaultValue={header?.Region_Name || ''}
                readOnly
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">
              <Label className="uppercase text-xs text-gray-600">
                Region Code
              </Label>
              <Input
                defaultValue={header?.Region_Code || ''}
                readOnly
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">  
              <Label className="uppercase text-xs text-gray-600">
                Outlet
              </Label>
              <Input
                defaultValue={header?.Outlet_Name || ''}
                readOnly
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">
              <Label className="uppercase text-xs text-gray-600">
                Outlet Code
              </Label>
              <Input
                defaultValue={header?.Outlet_Code || ''}
                readOnly
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">
              <Label className="uppercase text-xs text-gray-600">
                Captured Date
              </Label>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                readOnly
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">
              <Label className="uppercase text-xs text-gray-600">
                Captured Time
              </Label>
              <Input
                type="time"
                defaultValue={new Date().toTimeString().slice(0, 5)}
                readOnly
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">
              <Label className="uppercase text-xs text-gray-600">
                Sales Date
              </Label>
              <Input
                type="date"
                defaultValue={new Date(Date.now() - 86_400_000)
                  .toISOString()
                  .split('T')[0]}
                readOnly
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmitForApproval} disabled={loading}>
              {loading ? 'Sending…' : 'Send for Approval'}
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-4 pb-16">
          <Card className="bg-transparent p-0">
            <Table>
              <TableCaption>Individual Sales Targets</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>SKU Ltrs</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>SKU Ratio</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, idx) => (
                  <TableRow key={`${item.No}-${item.SN}-${idx}`}>
                    <TableCell>{item.Officer_Name}</TableCell>
                    <TableCell>{item.Role_Name}</TableCell>
                    <TableCell>
                      <select
                        className="border px-2 py-1 rounded"
                        value={item.Product_Code || ''}
                        onChange={e =>
                          handleProductChange(idx, e.target.value)
                        }
                        disabled={loading}
                      >
                        <option value="">-- select --</option>
                        {products.map(p => (
                          <option key={p.Code} value={p.Code}>
                            {p.Description}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>{item.Target}</TableCell>
                    <TableCell>
                      <select
                        className="border px-2 py-1 rounded"
                        value={item.SKU_Code || ''}
                        onChange={e =>
                          handleSKUChange(idx, e.target.value)
                        }
                        disabled={loading}
                      >
                        <option value="">-- select --</option>
                        {skus.map(s => (
                          <option key={s.SKU_Code} value={s.SKU_Code}>
                            {s.SKU_Name}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>{item.SKU_Liters}</TableCell>
                    <TableCell>{item.Grade}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-20"
                        value={item.Quantity || ''}
                        onChange={e =>
                          handleQuantityChange(idx, Number(e.target.value))
                        }
                        disabled={loading}
                      />
                    </TableCell>
                    <TableCell>{item.Total}</TableCell>
                    <TableCell>{item.SKU_Ratio}</TableCell>
                    <TableCell>{item.Commission_Earned}</TableCell>
                    <TableCell className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={createNewLine}
                        disabled={loading}
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteLine(item.No, item.SN)}
                        disabled={loading}
                      >
                        ✕
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
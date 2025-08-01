// components/RecordSales/RecordSalesForm.tsx

'use client'

import React, { useEffect, useState, FormEvent } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { API_AUTHORIZATION, API_BASE_URL } from '@/lib/constants'
import { ProductSKU, VivoProduct } from '@/types'
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

interface SalesLine {
  No: string
  SN: number
  Officer_Name: string
  Role_Name: string
  Product?: string
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

export default function RecordSalesForm({
  No,
  header,
  onClose,
}: {
  No: string
  header: {
    Region_Name: string
    Region_Code: string
    Outlet_Name: string
    Outlet_Code: string
  }
  onClose: () => void
}) {
  const [lineItems, setLineItems] = useState<SalesLine[]>([])
  const [products, setProducts] = useState<VivoProduct[]>([])
  const [SKU, setSKU] = useState<ProductSKU[]>([])
  const [toast, setToast] = useState<Toast | null>(null)

  // auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  // low-level PATCH helper
  async function patchLine(
    no: string,
    sn: number,
    payload: object,
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  // generic row-level patch with toast & spinner
  async function handlePatch(
    idx: number,
    payload: object,
    fieldName: string
  ) {
    setLineItems(prev =>
      prev.map((r, i) =>
        i === idx ? { ...r, isUpdating: true } : r
      )
    )

    const row = lineItems[idx]
    try {
      const updated = await patchLine(
        row.No,
        row.SN,
        payload,
        row['@odata.etag']
      )

      setLineItems(prev =>
        prev.map((r, i) =>
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
      setToast({ type: 'success', message: `${fieldName} updated` })
    } catch (error) {
      console.error(error)
      setLineItems(prev =>
        prev.map((r, i) =>
          i === idx ? { ...r, isUpdating: false } : r
        )
      )
      setToast({ type: 'error', message: `Failed to update ${fieldName}` })
    }
  }

  const handleProductChange = (idx: number, code: string) =>
    handlePatch(idx, { Product: code }, 'Product')

  const handleSKUChange = (idx: number, code: string) =>
    handlePatch(idx, { SKU_Code: code }, 'SKU')

  const handleQuantity = (idx: number, qty: number) =>
    handlePatch(idx, { Quantity: qty }, 'Quantity')

  // load sales lines
  useEffect(() => {
    if (!No) return
    fetch(`${API_BASE_URL}/NewSalesLines?$filter=No eq '${No}'`, {
      headers: { Authorization: API_AUTHORIZATION },
    })
      .then(res => res.json())
      .then(data =>
        setLineItems(
          (data.value || []).map((row: any) => ({
            ...row,
            isUpdating: false,
          }))
        )
      )
      .catch(console.error)
  }, [No])

  // load products & SKUs
  useEffect(() => {
    fetch(`${API_BASE_URL}/vivoproducts`, {
      headers: { Authorization: API_AUTHORIZATION },
    })
      .then(res => res.json())
      .then(data => setProducts(data.value || []))
      .catch(console.error)

    fetch(`${API_BASE_URL}/LubricantSKUs`, {
      headers: { Authorization: API_AUTHORIZATION },
    })
      .then(res => res.json())
      .then(data => setSKU(data.value || []))
      .catch(console.error)
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <Dialog open={!!No} onOpenChange={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <DialogTrigger asChild>
          <Button variant="default">
            <Icon icon="solar:add-circle-linear" className="text-xl text-white" />
            New Sale
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-fit max-h-[98vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Profile Details No: {No}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          {/* Sticky header + Save/Cancel */}
          <div className="bg-white border-b px-4 py-4 sticky top-[3.5rem] z-20 flex justify-between items-start">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="uppercase">Captured By</Label>
                <Input defaultValue={No} readOnly className="mt-2" />
              </div>
              <div>
                <Label className="uppercase">Region</Label>
                <Input defaultValue={header.Region_Name} readOnly className="mt-2" />
              </div>
              <div>
                <Label className="uppercase">Region Code</Label>
                <Input defaultValue={header.Region_Code} readOnly className="mt-2" />
              </div>
              <div>
                <Label className="uppercase">Outlet</Label>
                <Input defaultValue={header.Outlet_Name} readOnly className="mt-2" />
              </div>
              <div>
                <Label className="uppercase">Outlet Code</Label>
                <Input defaultValue={header.Outlet_Code} readOnly className="mt-2" />
              </div>
              <div>
                <Label className="uppercase">Captured Date</Label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  readOnly
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="uppercase">Captured Time</Label>
                <Input
                  type="time"
                  defaultValue={new Date().toTimeString().slice(0, 5)}
                  readOnly
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="uppercase">Sales Date</Label>
                <Input
                  type="date"
                  defaultValue={new Date(Date.now() - 86400000)
                    .toISOString()
                    .split('T')[0]}
                  readOnly
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Send for Approval
              </Button>
            </div>
          </div>

          {/* Inline toast banner */}
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

          {/* Scrollable table */}
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, idx) => (
                    <TableRow key={item.SN} className="even:bg-gray-50">
                      <TableCell className="font-medium">{item.Officer_Name}</TableCell>
                      <TableCell>{item.Role_Name}</TableCell>

                      <TableCell>
                        <select
                          className="w-full border rounded px-2 py-1"
                          disabled={item.isUpdating}
                          value={item.Product || ''}
                          onChange={e => handleProductChange(idx, e.target.value)}
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
                        <p className="text-center">{item.Target}</p>
                      </TableCell>

                      <TableCell>
                        <select
                          className="w-full border rounded px-2 py-1"
                          disabled={item.isUpdating}
                          value={item.SKU_Code || ''}
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
                        <p className="text-center">{item.SKU_Liters}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-center">{item.Grade}</p>
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          className="w-[100px]"
                          disabled={item.isUpdating}
                          value={item.Quantity}
                          onChange={e => handleQuantity(idx, Number(e.target.value))}
                        />
                      </TableCell>

                      <TableCell>
                        <p className="text-center">{item.Total}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-center">{item.SKU_Ratio}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-center">{item.Commission_Earned}</p>
                      </TableCell>

                      <TableCell className="flex justify-center items-center">
                        {item.isUpdating ? (
                          <Icon
                            icon="solar:spinner-loop-bold"
                            className="animate-spin text-2xl text-gray-500"
                          />
                        ) : (
                          <div className="flex space-x-2">
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
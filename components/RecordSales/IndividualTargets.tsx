'use client'
import React, { useState } from 'react'
import {
   Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from '../ui/table'
import { Card } from '../ui/card'
import {
   Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from '../ui/select'
import { IndividualTarget, ProductSKU, VivoProduct, VivoUserSessionDetails } from '@/types'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Trash2Icon } from 'lucide-react'

export function IndividualTargetsForm({
   targets,
   products,
   skus,
   user
}: {
   targets: IndividualTarget[],
   products?: VivoProduct[],
   skus?: ProductSKU[],
   user: VivoUserSessionDetails
}) {
   const [targetRows, setTargetRows] = useState(() =>
      targets.map(() => [
         { productCode: '', sku: null as ProductSKU | null, quantity: 0 }
      ])
   )

   const addRow = (targetIndex: number) => {
      setTargetRows(prev => {
         const updated = [...prev]
         updated[targetIndex] = [
            ...updated[targetIndex],
            { productCode: '', sku: null, quantity: 0 }
         ]
         return updated
      })
   }

   const removeRow = (targetIndex: number, rowIndex: number) => {
      setTargetRows(prev => {
         const updated = [...prev]
         updated[targetIndex] = updated[targetIndex].filter((_, i) => i !== rowIndex)
         return updated
      })
   }

   const updateRow = (
      targetIndex: number,
      rowIndex: number,
      field: 'productCode' | 'sku' | 'quantity',
      value: any
   ) => {
      setTargetRows(prev => {
         const updated = [...prev]
         const row = updated[targetIndex][rowIndex]
         if (field === 'sku') {
            const sku = skus?.find(s => s.SKU_Code === value) || null
            row.sku = sku
         } else if (field === 'productCode') {
            row.productCode = value
         } else if (field === 'quantity') {
            row.quantity = Number(value)
         }
         return updated
      })
   }

   return (
      <Card className="mt-4 bg-transparent p-4">
         <Table>
            <TableCaption>Individual Sales Targets</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Target (Litres)</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>SKU (Litres)</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total (L)</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {targets.map((target, targetIndex) => {
                  const userRows = targetRows[targetIndex]

                  return userRows.map((row, rowIndex) => {
                     const totalLitres = row.sku ? row.sku.SKU_Litres * row.quantity : 0
                     const variance = totalLitres - target.Daily_Target

                     return (
                        <TableRow key={`${targetIndex}-${rowIndex}`}>
                           {rowIndex === 0 && (
                              <>
                                 <TableCell rowSpan={userRows.length} className="font-medium">
                                    {target.User_Name}
                                 </TableCell>
                                 <TableCell rowSpan={userRows.length}>
                                    {target.Role_Name}
                                 </TableCell>
                              </>
                           )}
                           <TableCell>
                              <Select
                                 value={row.productCode}
                                 onValueChange={(val) => updateRow(targetIndex, rowIndex, 'productCode', val)}
                              >
                                 <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Product" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {products?.map(p => (
                                          <SelectItem key={p.Code} value={p.Code}>
                                             {p.Description}
                                          </SelectItem>
                                       ))}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           </TableCell>
                           <TableCell>{target.Daily_Target.toFixed(2)}</TableCell>
                           <TableCell>
                              <Select
                                 value={row.sku?.SKU_Code ?? ''}
                                 onValueChange={(val) => updateRow(targetIndex, rowIndex, 'sku', val)}
                              >
                                 <SelectTrigger className="w-[160px] mt-2">
                                    <SelectValue placeholder="SKU" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {skus?.map(s => (
                                          <SelectItem key={s.SKU_Code} value={s.SKU_Code}>
                                             {s.SKU_Name}
                                          </SelectItem>
                                       ))}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           </TableCell>
                           <TableCell>
                              <Input
                                 value={row.sku?.SKU_Litres ?? ''}
                                 readOnly
                                 className="bg-muted"
                              />
                           </TableCell>
                           <TableCell>
                              <Input
                                 value={row.sku?.Grade ?? ''}
                                 readOnly
                                 className="bg-muted"
                              />
                           </TableCell>
                           <TableCell>
                              <Input
                                 type="number"
                                 value={row.quantity}
                                 onChange={(e) => updateRow(targetIndex, rowIndex, 'quantity', e.target.value)}
                              />
                           </TableCell>
                           <TableCell>
                              <Input value={totalLitres.toFixed(2)} readOnly className="bg-muted" />
                           </TableCell>
                           <TableCell>
                              <Input value={variance.toFixed(2)} readOnly className="bg-muted" />
                           </TableCell>
                           <TableCell className="flex gap-2">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => addRow(targetIndex)}
                              >
                                 Add
                              </Button>
                              {userRows.length > 1 && (
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeRow(targetIndex, rowIndex)}
                                 >
                                    <Trash2Icon className="w-4 h-4 text-red-500" />
                                 </Button>
                              )}
                           </TableCell>
                        </TableRow>
                     )
                  })
               })}
            </TableBody>
         </Table>
      </Card>
   )
}

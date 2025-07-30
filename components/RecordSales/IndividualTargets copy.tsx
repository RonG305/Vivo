'use client'
import React, { useState } from 'react'
import {
   Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from '../ui/table';
import { Card } from '../ui/card';
import {
   Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from '../ui/select';
import {
   IndividualTarget, ProductSKU, VivoProduct, VivoUserSessionDetails
} from '@/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function IndividualTargetsForm({
   targets,
   products,
   skus,
}: {
   targets: IndividualTarget[],
   products?: VivoProduct[],
   skus?: ProductSKU[],
}) {
   const [rowStates, setRowStates] = useState<{
      [index: number]: { sku: ProductSKU | null; quantity: number };
   }>({});

   const handleSKUSelect = (index: number, skuCode: string) => {
      const sku = skus?.find((s) => s.SKU_Code === skuCode) || null;
      setRowStates((prev) => ({
         ...prev,
         [index]: {
            ...prev[index],
            sku,
         },
      }));
   };

   const handleQuantityChange = (index: number, value: number) => {
      setRowStates((prev) => ({
         ...prev,
         [index]: {
            ...prev[index],
            quantity: value,
         },
      }));
   };

   const VivoProducts = () => {
      return (
         <Select>
            <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                  {products?.map((product) => (
                     <SelectItem key={product.Code} value={product.Description}>
                        {product.Description}
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>
      )
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
                  <TableHead>Product Grade</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total (Litres)</TableHead>
                  <TableHead>Variance (Litres)</TableHead>
                  <TableHead>Commission Earned (KES)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {targets.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={12} className="text-center text-muted-foreground">
                        No sales records found.
                     </TableCell>
                  </TableRow>
               ) : (
                  targets.map((target, index) => {
                     const state = rowStates[index] || { sku: null, quantity: 0 };
                     const totalLitres = state.sku ? state.sku.SKU_Litres * state.quantity : 0;
                     const variance = totalLitres - target.Daily_Target;

                     return (
                        <TableRow key={index}>
                           <TableCell className="font-medium">{target.User_Name}</TableCell>
                           <TableCell>{target.Role_Name}</TableCell>
                           <TableCell>{<VivoProducts />}</TableCell>
                           <TableCell>{target.Daily_Target.toFixed(3)}</TableCell>
                           <TableCell>
                              <Select onValueChange={(value: any) => handleSKUSelect(index, value)}>
                                 <SelectTrigger className="w-full mt-2">
                                    <SelectValue placeholder="Select SKU" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {skus?.map((sku) => (
                                          <SelectItem key={sku.SKU_Code} value={sku.SKU_Code}>
                                             {sku.SKU_Name}
                                          </SelectItem>
                                       ))}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           </TableCell>
                           <TableCell>
                              <Input
                                 value={state.sku?.SKU_Litres ?? ''}
                                 readOnly
                                 className="mt-2 bg-muted"
                              />
                           </TableCell>
                           <TableCell>
                              <Input
                                 value={state.sku?.Grade ?? ''}
                                 readOnly
                                 className="mt-2 bg-muted"
                              />
                           </TableCell>
                           <TableCell>
                              <Input
                                 type="number"
                                 value={state.quantity}
                                 onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                 className="mt-2"
                              />
                           </TableCell>
                           <TableCell>
                              <Input
                                 value={totalLitres.toFixed(3)}
                                 readOnly
                                 className="mt-2 bg-muted"
                              />
                           </TableCell>
                           <TableCell>
                              <Input
                                 value={variance.toFixed(3)}
                                 readOnly
                                 className="mt-2 bg-muted"
                              />
                           </TableCell>
                           <TableCell>
                              <Input
                                 value={""}
                                 readOnly
                                 className="mt-2 bg-muted"
                              />
                           </TableCell>
                           <TableCell className="text-right">
                              <Button>Add</Button>
                           </TableCell>
                        </TableRow>
                     )
                  })
               )}
            </TableBody>
         </Table>
      </Card>
   )
}

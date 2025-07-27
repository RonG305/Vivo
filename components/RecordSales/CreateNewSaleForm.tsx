'use client'
import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IndividualTarget, ProductSKU, VivoUserSessionDetails } from "@/types"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function CreateNewSaleForm({ user, skus }: { user: VivoUserSessionDetails, skus?: ProductSKU[] , target?:IndividualTarget}) {
   const [selectedSKU, setSelectedSKU] = useState<ProductSKU | null>(null)
   const [quantity, setQuantity] = useState<number>(0)

   const handleSKUSelect = (skuCode: string) => {
      const sku = skus?.find((s) => s.SKU_Code === skuCode)
      setSelectedSKU(sku || null)
   }

   const totalLitres = selectedSKU ? selectedSKU.SKU_Litres * quantity : 0

   if (!user) {
      return (
         <div className="text-red-500">
            User not found. Please log in.
         </div>
      );
   }

   return (
      <Dialog>
         <form>
            <DialogTrigger asChild>
               <Button variant="default">
                  <Icon icon="solar:add-circle-linear" className='text-xl text-white' />
                  New Sale</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px]">
               <DialogHeader>
                  <DialogTitle>Add Sale For : { user?.username}</DialogTitle>
                  <DialogDescription>

                  </DialogDescription>
               </DialogHeader>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <Label >Target</Label>
                     <Input
                        id="target"
                        name="target"
                        defaultValue={user.username}
                        className="mt-2"
                     />
                  </div>
                  <div>
                     <Label>SKU</Label>
                     <Select onValueChange={handleSKUSelect}>
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
                  </div>
                  <div>
                     <Label>SKU (Litres)</Label>
                     <Input
                        id="sku_litres"
                        name="sku_litres"
                        value={selectedSKU?.SKU_Litres ?? ''}
                        readOnly
                        className="mt-2 bg-muted"
                     />
                  </div>

                  <div>
                     <Label>Grade</Label>
                     <Input
                        id="grade"
                        name="grade"
                        value={selectedSKU?.Grade ?? ''}
                        readOnly
                        className="mt-2 bg-muted"
                     />
                  </div>
                  <div>
                     <Label >Quantity</Label>
                     <Input
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="mt-2"
                     />
                  </div>

                  <div>
                     <Label>Total (Litres)</Label>
                     <Input
                        id="total_litres"
                        name="total_litres"
                        value={totalLitres.toFixed(3)}
                        readOnly
                        className="mt-2 bg-muted"
                     />
                  </div>

                  <div>
                     <Label >Variance (Litres)</Label>
                     <Input
                        id="quantity"
                        name="quantity"
                        defaultValue={user.username}
                        className="mt-2"
                     />
                  </div>

                  <div>
                     <Label >Commission</Label>
                     <Input
                        id="quantity"
                        name="quantity"
                        defaultValue={user.username}
                        className="mt-2"
                     />
                  </div>

               </div>
               <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
               </DialogFooter>
            </DialogContent>
         </form>
      </Dialog>
   )
}

import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { fetchData } from '@/lib/api'
import { API_AUTHORIZATION, API_BASE_URL } from '@/lib/constants'
import { ProductSKU, VivoProduct, VivoSalesHeader } from '@/types'
import { Card } from '../ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const RecordSalesForm = ({ No, header, onClose }: { No: string, header: any, onClose: () => void }) => {
   const [lineItems, setLineItems] = useState<any[]>([])
   const [products, setProducts] = useState<VivoProduct[]>([])
   const [SKU, setSKU] = useState<ProductSKU[]>([])
   const [selectedProduct, setSelectedProduct] = useState<string>("")
   const [target, setTarget] = useState<number>(7)
   const [selectedSKU, setSelectedSKU] = useState<string>("")
   const [skuLitres, setSKULitres] = useState<number>(0)
   const [grade, setGrade] = useState<string>("")
   const [qty, setQty] = useState<number>(0)
   const [total, setTotal] = useState<number>(0)

   // Patch on product select
   // const handleProductChange = (index: number, value: string) => {
   //    setSelectedProduct(value)
   //    setLineItems((prev) =>
   //       prev.map((item, i) => (i === index ? { ...item, Product: value } : item))
   //    )
   // }

   // Patch on Product Select
   // useEffect(() => {
   //    const patchProduct = async () => {
   //       try {
   //          const response = await fetch(`${API_BASE_URL}/NewSalesLines('${No}',${1})`, {
   //             method: "PATCH",
   //             headers: {
   //                "Content-Type": "application/json",
   //                ...({ Authorization: `${API_AUTHORIZATION}` }),
   //                "If-Match": "W/\"JzQ0O21KNzVZcS9helJVcE11OC9JcCtqRnhNb2xRR1NyYVJEbzRlNkkxQVc3S2s9MTswMDsn\"",
   //             },
   //             body: JSON.stringify({
   //                "@odata.etag": "W/\"JzQ0O21KNzVZcS9helJVcE11OC9JcCtqRnhNb2xRR1NyYVJEbzRlNkkxQVc3S2s9MTswMDsn\"",
   //                Product_Code: selectedProduct
   //             }),
   //          });

   //          if (!response.ok) {
   //             throw new Error(`HTTP error!, status: ${response.status}`);
   //          }

   //          const data = await response.json();
   //          console.log("Updated Sales Line: ", data);
   //       } catch (error) {
   //          console.error("Error updating sales line:", error);
   //       }
   //    }
   //    if (selectedProduct) {
   //       patchProduct()
   //    }
   // }, [selectedProduct, No])

   async function patchProduct(no: string, sn: number, productCode: string, etag: string) {
      try {
         const response = await fetch(
            `${API_BASE_URL}/NewSalesLines(No='${no}',SN=${sn})`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: API_AUTHORIZATION,
                  "If-Match": etag,
               },
               body: JSON.stringify({
                  Product_Code: productCode,
               }),
            }
         );

         if (!response.ok) {
            throw new Error(`HTTP error!, status: ${response.status}`);
         }

         const data = await response.json();
         console.log("updated Sales Line:", data);
         setTarget(data.Target || 0);
         return data;
      } catch (error) {
         console.error(" Error updating sales line:", error);
         throw error;
      }
   }

   const handleProductChange = async (rowIndex: number, productCode: string) => {
      const row = lineItems[rowIndex];
      if (!row) return;

      try {
         setLineItems((prev) =>
            prev.map((l, i) => (i === rowIndex ? { ...l, Product: productCode } : l))
         );
         const updated = await patchProduct(row.No, row.SN, productCode, row["@odata.etag"]);
         // setLineItems((prev) =>
         //    prev.map((l, i) => (i === rowIndex ? { ...l, "@odata.etag": updated["@odata.etag"] } : l))
         // );
         setLineItems((prev) =>
            prev.map((l, i) =>
               i === rowIndex
                  ? {
                     ...l,
                     "@odata.etag": updated["@odata.etag"],
                     Target: updated.Target,


                  }
                  : l
            )
         );
      } catch (err) {
         console.error("Patch failed:", err);
      }
   };


   async function patchSKU(no: string, sn: number, SKU_Code: string, etag: string) {
      try {
         const response = await fetch(
            `${API_BASE_URL}/NewSalesLines(No='${no}',SN=${sn})`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: API_AUTHORIZATION,
                  "If-Match": etag,
               },
               body: JSON.stringify({
                  SKU_Code: SKU_Code,
               }),
            }
         );

         if (!response.ok) {
            throw new Error(`HTTP error!, status: ${response.status}`);
         }

         const data = await response.json();
         console.log("updated Sales Line:", data);
         setTarget(data.Target || 0);
         return data;
      } catch (error) {
         console.error(" Error updating sales line:", error);
         throw error;
      }
   }


   async function patchQuantity(no: string, sn: number, Quantity: number, etag: string) {
      try {
         const response = await fetch(
            `${API_BASE_URL}/NewSalesLines(No='${no}',SN=${sn})`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: API_AUTHORIZATION,
                  "If-Match": etag,
               },
               body: JSON.stringify({
                  Quantity: Quantity,
               }),
            }
         );

         if (!response.ok) {
            throw new Error(`HTTP error!, status: ${response.status}`);
         }

         const data = await response.json();
         return data;
      } catch (error) {
         console.error(" Error updating sales line:", error);
         throw error;
      }
   }


   const handleQuantity = async (rowIndex: number, Quantity: number) => {
      const row = lineItems[rowIndex];
      if (!row) return;

      const quantityNUmber = Number(Quantity);

      try {
         setLineItems((prev) =>
            prev.map((l, i) => (i === rowIndex ? { ...l, Quantity: quantityNUmber } : l))
         );
         const updated = await patchQuantity(row.No, row.SN, Quantity, row["@odata.etag"]);

         setLineItems((prev) =>
            prev.map((l, i) =>
               i === rowIndex
                  ? {
                     ...l,
                     "@odata.etag": updated["@odata.etag"],
                     Total: updated.Total,
                     SKU_Ratio: updated.SKU_Ratio,
                     Commission_Earned: updated.Commission_Earned,

                  }
                  : l
            )
         );

      } catch (err) {
         console.error("Patch failed:", err);
      }
   };

   const handleSKUChange = async (rowIndex: number, SKU_Code: string) => {
      const row = lineItems[rowIndex];
      if (!row) return;

      try {
         setLineItems((prev) =>
            prev.map((l, i) => (i === rowIndex ? { ...l, SKU_Code: SKU_Code } : l))
         );
         const updated = await patchSKU(row.No, row.SN, SKU_Code, row["@odata.etag"]);

         setLineItems((prev) =>
            prev.map((l, i) =>
               i === rowIndex
                  ? {
                     ...l,
                     "@odata.etag": updated["@odata.etag"],
                     SKU_Code: updated.SKU_Code,
                     SKU_Liters: updated.SKU_Liters,
                     Grade: updated.SKU_Grade,
                     Quantity: updated.Quantity,
                     Total: updated.Total

                  }
                  : l
            )
         );

      } catch (err) {
         console.error("Patch failed:", err);
      }
   };




   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch(`${API_BASE_URL}/NewSalesLines?$filter=No eq '${No}'`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  ...({ Authorization: `${API_AUTHORIZATION}` }),
               },
            });

            if (!response.ok) {
               throw new Error(`HTTP error!, status: ${response.status}`);
            }

            const data = await response.json()
            console.log("RETURENED SALES LINES: ", data?.value)
            setLineItems(data?.value)
            console.log("RESPONSE OF HEADER : ", await response.json())

            return await response.json();

         } catch (error) {
            throw error;
         }
      }

      fetchData()
   }, [No])

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const response = await fetch(`${API_BASE_URL}/vivoproducts`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  ...({ Authorization: `${API_AUTHORIZATION}` }),
               },
            });

            if (!response.ok) {
               throw new Error(`HTTP error!, status: ${response.status}`);
            }

            const data = await response.json()
            console.log("Vivo products: ", data?.value)
            setProducts(data?.value || [])
            return await response.json();

         } catch (error) {
            throw error;
         }
      }
      fetchProducts()
   }, [])

   useEffect(() => {
      const fetchProductSKUs = async () => {
         try {
            const response = await fetch(`${API_BASE_URL}/LubricantSKUs`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  ...({ Authorization: `${API_AUTHORIZATION}` }),
               },
            });

            if (!response.ok) {
               throw new Error(`HTTP error!, status: ${response.status}`);
            }

            const data = await response.json()
            console.log("Vivo products: ", data?.value)
            setSKU(data?.value || [])
            return await response.json();

         } catch (error) {
            throw error;
         }
      }
      fetchProductSKUs()
   }, [])



   return (
      <div>
         <Dialog open={!!No} onOpenChange={onClose}>
            <form>
               <DialogTrigger asChild>
                  <Button variant="default">
                     <Icon icon="solar:add-circle-linear" className='text-xl text-white' />
                     New Sale</Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-fit max-h-[95vh] overflow-y-auto overflow-x-auto">
                  <DialogHeader>
                     <DialogTitle>Profile Details No : {No}</DialogTitle>
                     <DialogDescription>

                     </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label className="uppercase">Captured By</Label>
                        <Input
                           id="Record"
                           name="record"
                           defaultValue={No}
                           readOnly
                           className="mt-2"
                        />
                     </div>
                     <div>
                        <Label className="uppercase">Region</Label>
                        <Input
                           id="region"
                           name="region"
                           defaultValue={header?.Region_Name}
                           readOnly
                           className="mt-2"
                        />
                     </div>
                     <div>
                        <Label className="uppercase">Region Code</Label>
                        <Input
                           id="region-code"
                           name="region_code"
                           defaultValue={header?.Region_Code}
                           readOnly
                           className="mt-2"
                        />
                     </div>
                     <div>
                        <Label className="uppercase">Outlet</Label>
                        <Input
                           id="outlet"
                           name="outlet"
                           defaultValue={header?.Outlet_Name}
                           readOnly
                           className="mt-2"
                        />
                     </div>
                     <div>
                        <Label className="uppercase">Outlet Code</Label>
                        <Input
                           id="outlet-code"
                           name="outlet_code"
                           defaultValue={header?.Outlet_Code}
                           readOnly
                           className="mt-2"
                        />
                     </div>
                     <div>
                        <Label className="uppercase">Captured Date</Label>
                        <Input
                           id="captured-date"
                           name="captured_date"
                           type="date"
                           defaultValue={new Date().toISOString().split("T")[0]}
                           className="mt-2"
                        />
                     </div>

                     <div>
                        <Label className="uppercase">Captured Time</Label>
                        <Input
                           id="captured-time"
                           name="captured_time"
                           type="time"
                           defaultValue={new Date().toTimeString().split(" ")[0].substring(0, 5)}
                           className="mt-2"
                        />
                     </div>
                     <div>
                        <Label className="uppercase">Sales Date</Label>
                        <Input
                           id="sales-date"
                           name="sales_date"
                           type="date"
                           defaultValue={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
                           className="mt-2"
                        />

                     </div>

                  </div>

                  {/* New Sales Lines */}
                  <div>
                     <Card className="mt-4 bg-transparent p-4">
                        <Table>
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
                              {lineItems?.map((item, index) => (
                                 <TableRow key={index}>
                                    <TableCell className="font-medium">{item.Officer_Name}</TableCell>
                                    <TableCell>{item.Role_Name}</TableCell>

                                    {/* Product Select */}
                                    <TableCell>
                                       <select
                                          className="w-[200px] border rounded px-2 py-1"
                                          value={item.Product || ""}
                                          onChange={(e) => handleProductChange(index, e.target.value)}
                                       >
                                          <option value="">Select Product</option>
                                          {products?.map((product) => (
                                             <option key={product.Code} value={product.Code}>
                                                {product.Description}
                                             </option>
                                          ))}
                                       </select>
                                    </TableCell>


                                    {/* Target (Ltrs) */}
                                    <TableCell>
                                       {/* <Input
                                             type="text"
                                             className="w-[100px]"
                                             value={item.Target || ""}
                                             
                                          /> */}
                                       <p>{item.Target}</p>
                                    </TableCell>

                                    <TableCell>
                                       <select
                                          className="w-[200px] border rounded px-2 py-1"
                                          value={item.SKU_Code || ""}
                                          onChange={(e) => handleSKUChange(index, e.target.value)}
                                       >
                                          <option value="">Select SKU</option>
                                          {SKU?.map((sku) => (
                                             <option key={sku.SKU_Code} value={sku.SKU_Code}>
                                                {sku.SKU_Name}
                                             </option>
                                          ))}
                                       </select>
                                    </TableCell>

                                    {/* SKU (Ltrs) */}
                                    <TableCell>
                                   
                                       <p>{item.SKU_Liters}</p>
                                    </TableCell>



                                    {/* Grade */}
                                    <TableCell>
                                       {/* <Input
                                             type="text"
                                             className="w-[100px]"
                                             value={item.Grade ||  ""}
                                             readOnly
                                           
                                          /> */}
                                       <p>{item.Grade}</p>
                                    </TableCell>

                                    {/* Qty */}
                                    <TableCell>
                                       <Input
                                          type="number"
                                          className="w-[100px]"
                                          onChange={(e) => handleQuantity(index, Number(e.target.value))}

                                       />
                                    </TableCell>

                                    {/* Total (Ltrs) */}
                                    <TableCell>
                                       {/* <Input
                                             type="text"
                                             className="w-[100px]"
                                             value={item.Total || ""}
                                             readOnly
                                          /> */}
                                       <p>{item.Total}</p>
                                    </TableCell>

                                    {/* Cumulative Total (Ltrs) */}
                                    <TableCell>

                                       <p>{item.SKU_Ratio}</p>
                                    </TableCell>

                                    {/* Variance */}
                                    <TableCell>
                                       <p>{item.Commission_Earned}</p>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                       <Button variant="outline" size="sm" className="mr-2">+</Button>
                                       <Button variant="destructive" size="sm">x</Button>
                                    </TableCell>
                                 </TableRow>
                              ))}


                           </TableBody>
                        </Table>
                     </Card>

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
      </div>
   )
}

export default RecordSalesForm

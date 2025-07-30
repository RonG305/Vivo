'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption, TableFooter } from "@/components/ui/table"
import { Card } from "../ui/card"
import { OpenSale, VivoSalesHeader } from "@/types"
import { Badge } from "../ui/badge"
import { CreateNewSale } from "./CreateNewSale"
import { Button } from "../ui/button"
import Link from "next/link"
import { CreateNewSaleForm } from "./CreateNewSaleForm"
import { RecordNewSale } from "./RecordNewSale"
import CreateNewHeader from "./CreateNewHeader"
import CreateNewHeaderCopy from "./CreateNewHeaderCopy"
import PendingRecordSalesViewWrapper from "./PendingRecordSalesViewWrapper"




export function RecordSalesList({ data }: { data: VivoSalesHeader[] }) {

   return (
      <div>
         <div className='flex items-center justify-between mb-4'>
            <h2 className='font-medium text-xl'>Record Sales</h2>
           <CreateNewHeaderCopy />
          {/* <RecordNewSale /> */}
            </div>
            <Card className="mt-4 bg-transparent h-[80vh] overflow-y-auto overflow-x-auto">
               <Table>
                  <TableCaption>Sales records for {data && data[0]?.Outlet_Name}</TableCaption>
                  <TableHeader>
                     <TableRow>
                     <TableHead className="w-[100px]">No
                  
                        </TableHead>
                     {/* <TableHead>Outlet Code</TableHead> */}
                     <TableHead>Outlet Name</TableHead>
                     {/* <TableHead>Region Code</TableHead> */}
                        <TableHead>Region Name</TableHead>
                        <TableHead>Date Captured</TableHead>
                        <TableHead>Time Captured</TableHead>
                        <TableHead className="text-right">Target (Ltrs)</TableHead>
                        <TableHead className="text-right">Achieved (Ltrs)</TableHead>
                        <TableHead className="text-right">Commission Earned (KES)</TableHead>
                        <TableHead>Status</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {data.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={9} className="text-center text-muted-foreground">
                              No sales records found.
                           </TableCell>
                        </TableRow>
                     )}
                     {data.map((sale) => (
                        <TableRow key={sale.No}>
                           <TableCell className="font-medium">
                              <PendingRecordSalesViewWrapper No={sale.No} />
                           </TableCell>
                           {/* <TableCell>{sale.Outlet_Code}</TableCell> */}
                           <TableCell>{sale.Outlet_Name}</TableCell>
                           {/* <TableCell>{sale.Region_Code}</TableCell> */}
                           <TableCell>{sale.Region_Name}</TableCell>
                           <TableCell>{sale.Date_Captured}</TableCell>
                           <TableCell>{sale.Time_Captured}</TableCell>
                           <TableCell className="text-right">{(sale?.Total_Target)}</TableCell>
                           <TableCell className="text-right">{(sale?.Total_Target)}</TableCell>
                           <TableCell className="text-right">{(sale?.Total_Commission_Earned)}</TableCell>
                           <TableCell>
                              <Badge variant={sale?.Status === "Open" ? "secondary" : "destructive"}>
                                 {sale.Status}
                              </Badge>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
                  {data.length > 0 && (
                     <TableFooter>
                        <TableRow>
                           <TableCell colSpan={5}>Totals</TableCell>
                           {/* <TableCell className="text-right">{totalTarget.toFixed(2)}</TableCell>
                           <TableCell className="text-right">{totalSales.toFixed(2)}</TableCell>
                           <TableCell className="text-right">{totalCommission.toFixed(2)}</TableCell> */}
                           <TableCell></TableCell>
                        </TableRow>
                     </TableFooter>
                  )}

               </Table>
         </Card>
         <CreateNewHeader />
         </div>
     
   )
}
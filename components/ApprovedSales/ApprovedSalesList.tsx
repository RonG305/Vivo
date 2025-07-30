import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption, TableFooter } from "@/components/ui/table"
import { Card } from "../ui/card"
import { VivoSalesHeader } from "@/types"
import { Badge } from "../ui/badge"




export function ApprovedSalesList({ data }: { data: VivoSalesHeader[] }) {

   return (
      <div>
         <div className='flex items-center justify-between mb-4'>
            <h2 className='font-medium text-xl'>Approved Sales</h2>

         </div>
         <Card className="mt-4 bg-transparent">
            <Table>
               <TableCaption>Sales records for {data && data[0]?.Outlet_Name}</TableCaption>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-[100px]">No</TableHead>
                     <TableHead>Outlet Name</TableHead>
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
                        <TableCell className="font-medium">{sale.No}</TableCell>
                        <TableCell>{sale.Outlet_Name}</TableCell>
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
      </div>

   )
}
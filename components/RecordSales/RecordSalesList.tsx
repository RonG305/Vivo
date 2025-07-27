import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption, TableFooter } from "@/components/ui/table"
import { Card } from "../ui/card"
import { OpenSale } from "@/types"
import { Badge } from "../ui/badge"
import { CreateNewSale } from "./CreateNewSale"
import { Button } from "../ui/button"
import Link from "next/link"




export function RecordSalesList({ data }: { data: OpenSale[] }) {
   const totalCommission = data.reduce((sum, item) => sum + (item.Total_Commission_Value || 0), 0)
   const totalSales = data.reduce((sum, item) => sum + (item.Total_Sales_in_Liters || 0), 0)
   const totalTarget = data.reduce((sum, item) => sum + (item.Total_Target || 0), 0)

   return (
      <div>
         <div className='flex items-center justify-between mb-4'>
            <h2 className='font-medium text-xl'>Record Sales</h2>
            <Link href="/dashboard/record-sales/new-sale">
               <Button>Add New</Button>
               </Link>
            </div>
            <Card className="mt-4 bg-transparent">
               <Table>
                  <TableCaption>Sales records for {data && data[0]?.Outlet_Name}</TableCaption>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-[100px]">No</TableHead>
                        <TableHead>Outlet</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Target (Ltrs)</TableHead>
                        <TableHead className="text-right">Actual (Ltrs)</TableHead>
                        <TableHead className="text-right">Commission (KES)</TableHead>
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
                           <TableCell>{sale.Actual_Date}</TableCell>
                           <TableCell>{sale.Sales_Time}</TableCell>
                           <TableCell className="text-right">{(sale.Total_Target).toFixed(3)}</TableCell>
                           <TableCell className="text-right">{(sale.Total_Sales_in_Liters).toFixed(3)}</TableCell>
                           <TableCell className="text-right">{(sale.Total_Commission_Value).toFixed(3)}</TableCell>
                           <TableCell>
                              <Badge variant={sale.Status === "Open" ? "secondary" : "destructive"}>
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
                           <TableCell className="text-right">{totalTarget.toFixed(2)}</TableCell>
                           <TableCell className="text-right">{totalSales.toFixed(2)}</TableCell>
                           <TableCell className="text-right">{totalCommission.toFixed(2)}</TableCell>
                           <TableCell></TableCell>
                        </TableRow>
                     </TableFooter>
                  )}

               </Table>
            </Card>
         </div>
     
   )
}
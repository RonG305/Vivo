'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
  TableFooter,
} from '@/components/ui/table'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import CreateNewHeaderCopy from './CreateNewHeaderCopy'
import PendingRecordSalesViewWrapper from './PendingRecordSalesViewWrapper'
import { VivoSalesHeader } from '@/types'

interface Props {
  data: VivoSalesHeader[]
}

export function RecordSalesList({ data }: Props) {
  // compute grand totals
  const { totalTarget, totalAchieved, totalCommission } = useMemo(() => {
    return data.reduce(
      (acc, s) => {
        acc.totalTarget += s.Total_Target ?? 0
        // replace `Total_Quantity` with the actual field name for "Achieved"
        acc.totalAchieved += s.Total_Achieved ?? 0
        acc.totalCommission += s.Total_Commission_Earned ?? 0
        return acc
      },
      { totalTarget: 0, totalAchieved: 0, totalCommission: 0 }
    )
  }, [data])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-xl">Record Sales</h2>
        <CreateNewHeaderCopy />
      </div>

      <Card className="mt-4 bg-transparent h-[80vh] overflow-auto">
        <Table>
          <TableCaption>
            Sales records for {data[0]?.Outlet_Name || '—'}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Outlet Code</TableHead>
              <TableHead>Outlet Name</TableHead>
              <TableHead>Region Code</TableHead>
              <TableHead>Region Name</TableHead>
              <TableHead>Sales Date</TableHead>
              <TableHead>Date Captured</TableHead>
              <TableHead>Time Captured</TableHead>
              <TableHead className="text-right">Target (Ltrs)</TableHead>
              <TableHead className="text-right">Achieved (Ltrs)</TableHead>
              <TableHead className="text-right">Commission (KES)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center text-muted-foreground"
                >
                  No sales records found.
                </TableCell>
              </TableRow>
            )}

            {data.map((sale) => (
              <TableRow key={sale.No}>
                <TableCell className="font-medium">
                  <PendingRecordSalesViewWrapper No={sale.No} />
                </TableCell>
                <TableCell>{sale.Outlet_Code}</TableCell>
                <TableCell>{sale.Outlet_Name}</TableCell>
                <TableCell>{sale.Region_Code}</TableCell>
                <TableCell>{sale.Region_Name}</TableCell>
                <TableCell>{sale.Sales_Date}</TableCell>
                <TableCell>{sale.Date_Captured}</TableCell>
                <TableCell>{sale.Time_Captured}</TableCell>
                <TableCell className="text-right">
                  {sale.Total_Target.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {/* use your actual field here */}
                  {sale.Total_Achieved.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {sale.Total_Commission_Earned.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={sale.Status === 'Open' ? 'secondary' : 'destructive'}
                  >
                    {sale.Status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {data.length > 0 && (
            <TableFooter>
              <TableRow>
                {/* span first 8 columns to leave room for 3 totals + status */}
                <TableCell colSpan={8}>Totals</TableCell>
                <TableCell className="text-right">
                  {totalTarget.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {totalAchieved.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {totalCommission.toFixed(2)}
                </TableCell>
                {/* blank cell under “Status” */}
                <TableCell />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </Card>

      {/* still render below the table if you need it */}
      <CreateNewHeaderCopy />
    </div>
  )
}
import PendingSalesList from '@/components/PendingSales/PendingSalesList'

import { RecordSalesList } from '@/components/RecordSales/RecordSalesList';
import { RejectedSalesList } from '@/components/RejectedSales.tsx/RejectedSales';
import { fetchData } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';
import { getUserData } from '@/lib/get-user';
import {  VivoSalesHeader } from '@/types';
import React from 'react';

const page = async () => {
   const user = await getUserData();
   const rejectedSales = await fetchData(
      `${API_BASE_URL}/NewRejectList?$filter=Region_Code eq '${user?.region_code}' and Outlet_Code eq '${user?.outlet_code}'`,
   );

   const rejected: VivoSalesHeader[] = rejectedSales?.value || [];
   return (
      <>
         <RejectedSalesList data={rejected} />
      </>
   );
};

export default page;

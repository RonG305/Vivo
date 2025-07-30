import { PendingSalesList } from '@/components/PendingSales/PendingSales';
import { RecordSalesList } from '@/components/RecordSales/RecordSalesList';
import { fetchData } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';
import { getUserData } from '@/lib/get-user';
import {  VivoSalesHeader } from '@/types';
import React from 'react';

const page = async () => {
   const user = await getUserData();
   const pendingSales = await fetchData(
      `${API_BASE_URL}/NewPendingSalesList2?$filter=Region_Code eq '${user?.region_code}' and Outlet_Code eq '${user?.outlet_code}'`,
   );

   const pending: VivoSalesHeader[] = pendingSales?.value || [];
   return (
      <>
         <PendingSalesList data={pending} />
      </>
   );
};

export default page;

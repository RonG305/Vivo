
import { ApprovedSalesList } from '@/components/ApprovedSales/ApprovedSalesList';
import { RecordSalesList } from '@/components/RecordSales/RecordSalesList';
import { fetchData } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';
import { getUserData } from '@/lib/get-user';
import {  VivoSalesHeader } from '@/types';
import React from 'react';

const page = async () => {
   const user = await getUserData();
   const approvedSales = await fetchData(
      `${API_BASE_URL}/NewApprovedSalesList2?$filter=Region_Code eq '${user?.region_code}' and Outlet_Code eq '${user?.outlet_code}'`,
   );

   const approved: VivoSalesHeader[] = approvedSales?.value || [];
   return (
      <>
         <ApprovedSalesList data={approved} />
      </>
   );
};

export default page;
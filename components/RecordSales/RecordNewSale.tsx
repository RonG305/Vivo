'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { API_BASE_URL } from '@/lib/constants';
import { createData } from '@/lib/api';

export function RecordNewSale() {
   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [saleInfo, setSaleInfo] = useState(null);
   const [error, setError] = useState('');

   const user = localStorage.getItem('vivoUser') ? JSON.parse(localStorage.getItem('vivoUser') || '{}') : null;

   const handleFormSubmit = async (e: any) => {
      console.log("Form submitted");
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
         if (!user) {
            throw new Error('User not authenticated');
         }

         // Prepare sale data
         const saleData = {
            "@odata.etag": "W/\"JzQ0OzdYTmQ4R1M5YnJraUp5bVltVjhSOWxFL0FoWFh3bzluWGFkaUNTZWJhQ2s9MTswMDsn\"",
            "Region_Code": "RG-01",
            "Outlet_Code": "OTL-04"
         };

         // Create new sale
         const createResponse = await createData(
            `${API_BASE_URL}/NewSalesHeader`,
            saleData
         );

         if (!createResponse.ok) {
            throw new Error(`Sale creation failed with status ${createResponse.status}`);
         }

         const createdSale = await createResponse.json();
         const saleNo = createdSale.No;

         // Fetch created sale details
         const detailsResponse = await fetch(
            `http://109.123.250.165:8048/VIVOAPI/ODataV4/Company('VIVO')/NewOpenSalesList_2?$filter=No eq '${saleNo}'`
         );

         if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch sale details: ${detailsResponse.status}`);
         }

         const detailsData = await detailsResponse.json();
         setSaleInfo(detailsData.value[0]);

      } catch (err) {
         setError('An error occurred while processing the sale');
         console.error("Sale processing error:", err);
      } finally {
         setIsLoading(false);
      }
   };

   if (!user) {
      return (
         <div className="text-red-500">
            Loading user data...
         </div>
      );
   }

   return (
      <form onSubmit={handleFormSubmit}>
         <Button type="submit" variant="default">Cancel</Button>
      </form>

   );
}

import React from 'react'
import { getUserData } from '@/lib/get-user';
import VivoUserDetails from './VivoUserDetails';
import { API_BASE_URL } from '@/lib/constants';
import { fetchData } from '@/lib/api';
import { IndividualTargetsForm } from './IndividualTargets';

export async function RecordNewSale() {
   const user = await getUserData();
   if (!user) {
      return (
         <div className="text-red-500">
            User not found. Please log in.
         </div>
      );
   }

   const [
      fetchIndividualTargets,
      fetchVivoProducts,
      fetchVivoSKUs,
   ] = await Promise.all([
      fetchData(
         `${API_BASE_URL}/VivoIndividualTargets?$filter=Region_Code eq '${user.region_code}' and Outlet_Code eq '${user.outlet_code}'`
      ),
      fetchData(`${API_BASE_URL}/vivoproducts`),
      fetchData(`${API_BASE_URL}/LubricantSKUs`),
   ]);

   const individualTargetsData = fetchIndividualTargets?.value || [];
   const vivoProductsData = fetchVivoProducts?.value || [];
   const vivoSKUsData = fetchVivoSKUs?.value || [];

   return (
      <div>
         <h1 className="text-2xl font-bold mb-4">Record New Sale</h1>
         <VivoUserDetails />
         <IndividualTargetsForm
            targets={individualTargetsData}
            products={vivoProductsData}
            skus={vivoSKUsData}
            user={user}
         />
      </div>
   )
}


""
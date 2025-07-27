import { API_BASE_URL } from "./constants";

export const endpoints = {
   getSalesDataOutlet: (regionCode: string, outletCode: string) =>  `${API_BASE_URL}/ODataV4/Company('VIVO')/VivoSalesData?$filter=Region_Code eq '${regionCode}' and Outlet_Code eq '${outletCode}'`,

}

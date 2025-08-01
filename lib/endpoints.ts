import { API_BASE_URL } from './constants'

export const endpoints = {
  // OData query to fetch sales data by region and outlet
  getSalesDataOutlet: (regionCode: string, outletCode: string) =>
    `${API_BASE_URL}/VivoSalesData?$filter=Region_Code eq '${regionCode}' and Outlet_Code eq '${outletCode}'`,

  // Unbound approval action; no JSON body required
  sendRequestForApproval: () => `${API_BASE_URL}/SendRequestForApproval`,
}
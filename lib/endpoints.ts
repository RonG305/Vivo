import { API_BASE_URL } from './constants'

export const endpoints = {
  // existing…
  getSalesDataOutlet: (regionCode: string, outletCode: string) =>
    `${API_BASE_URL}/VivoSalesData?$filter=Region_Code eq '${regionCode}' and Outlet_Code eq '${outletCode}'`,

  // existing unbound approval action
  sendRequestForApproval: () => `${API_BASE_URL}/SendRequestForApproval`,

  // newly added unbound actions
  returnBackToOpen:   () => `${API_BASE_URL}/ReturnBackToOpen`,
  approveRequest:     () => `${API_BASE_URL}/ApproveRequest`,
  rejectRequest:      () => `${API_BASE_URL}/RejectRequest`,
}
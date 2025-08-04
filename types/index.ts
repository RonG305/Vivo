/**
 * Represents a high-level “open sale” record
 */
export interface OpenSale {
  "@odata.etag": string
  No: string
  Sales_Date: string
  Sales_Time: string
  Captured_By: string
  Region_Code: string
  Region_Name: string
  Outlet_Code: string
  Outlet_Name: string
  Sales_Description: string
  Total_Sales_in_Liters: number
  Total_Commission_Liters: number
  Total_Commission_Value: number
  Status: string
  Total_Target: number
  Actual_Date: string
}

/**
 * Represents the header row of a sales record
 */
export interface VivoSalesHeader {
  "@odata.etag": string
  No: string
  Date_Captured: string
  Time_Captured: string
  Sales_Date: string
  Region_Code: string
  Region_Name: string
  Outlet_Code: string
  Outlet_Name: string
  Total_Target: number
  Total_Achieved: number
  Total_Commission_Earned: number
  Status: string
}

/**
 * Represents an individual line within a sale
 * fetched from the NewSalesLines endpoint
 */
export interface VivoSalesLine {
  "@odata.etag": string
  No: string           // matches the header No
  Line_No: number      // line sequence
  SKU_Code: string
  SKU_Name: string
  Litres_Sold: number
  Commission_Earned: number
  Status?: string
}

/**
 * Business Central user record
 */
export interface VivoUser {
  "@odata.etag": string
  Bitsn_UserName: string
  User_ID: string
  Name: string
  Role_ID: string
  Role_Name: string
  Phone_Number: string
  Email_Address: string
  Region_Code: string
  Region_Name: string
  Outlet_Code: string
  Outlet_Name: string
  Password: string
  Multiplierfactor: number
  User_target: number
  Enabled: boolean
}

/**
 * Your client-side session payload
 */
export interface VivoUserSessionDetails {
  "@odata.etag": string   // now declared

  username: string        // Bitsn_UserName
  name: string            // display name
  role: string            // Role_Name
  region: string          // human-readable Region_Name
  region_code: string     // Region_Code
  outlet: string          // Outlet_Name
  outlet_code: string     // Outlet_Code
  token: string           // auth token, if any

  // allow safe indexing of other props if needed
  [key: string]: unknown
}

/**
 * Product catalog entry
 */
export interface VivoProduct {
  "@odata.etag": string
  Code: string
  Description: string
  Commission_Rate: number
}

/**
 * Individual sales target per user
 */
export interface IndividualTarget {
  "@odata.etag": string
  User_code: string
  User_Name: string
  Role_ID: string
  Role_Name: string
  Daily_Target: number
  Region_Code: string
  Region_Name: string
  Outlet_Code: string
  Outlet_Name: string
  SKU_Code?: string
  SKU_Name?: string
  SKU_Litres?: number
  Grade?: string
  Incentive_Ratio?: number
  Target_Date: string
}

/**
 * SKU lookup from ProductSKU endpoint
 */
export interface ProductSKU {
  "@odata.etag": string
  SKU_Code: string
  SKU_Name: string
  SKU_Litres: number
  Grade: string
  Incentive_Ratio: number
}

/**
 * Generic response shape for unbound approval actions
 */
export interface ApprovalResponse {
  ResponseCode?: number
  ResponseMessage: string
}

/**
 * Interface for the new Approved Sales List records.
 */
export interface NewApprovedSalesRecord {
  No: string
  Region_Code: string
  Region_Name: string
  Outlet_Code: string
  Outlet_Name: string
  Sale_Date: string
  Date_Captured: string
  Time_Captured: string
  Total_Target: number
  Total_Commission_Earned: number
  Status: string
}

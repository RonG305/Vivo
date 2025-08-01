// types/index.ts

export interface OpenSale {
  "@odata.etag": string;
  No: string;
  Sales_Date: string;  
  Sales_Time: string;  
  Captured_By: string;  
  Region_Code: string;  
  Region_Name: string;  
  Outlet_Code: string;  
  Outlet_Name: string;  
  Sales_Description: string;  
  Total_Sales_in_Liters: number;  
  Total_Commission_Liters: number;  
  Total_Commission_Value: number;  
  Status: string;  
  Total_Target: number;  
  Actual_Date: string;  
}

export interface VivoSalesHeader {
  "@odata.etag": string;
  No: string;
  Date_Captured: string;
  Time_Captured: string;
  Sales_Date: string;
  Region_Code: string;
  Region_Name: string;
  Outlet_Code: string;
  Outlet_Name: string;
  Total_Target: number;
  Total_Achieved: number;
  Total_Commission_Earned: number;
  Status: string;
}

export interface VivoUser {
  "@odata.etag": string;
  Bitsn_UserName: string;
  User_ID: string;
  Name: string;
  Role_ID: string;
  Role_Name: string;
  Phone_Number: string;
  Email_Address: string;
  Region_Code: string;
  Region_Name: string;
  Outlet_Code: string;
  Outlet_Name: string;
  Password: string;
  Multiplierfactor: number;
  User_target: number;
  Enabled: boolean;
}

// <-- Update this block:
export interface VivoUserSessionDetails {
  username: string;     // e.g. Bitsn_UserName
  name: string;         // your display name
  role: string;         // e.g. Role_Name
  region: string;       // human-readable Region_Name
  region_code: string;  // Region_Code
  outlet: string;       // Outlet_Name
  outlet_code: string;  // Outlet_Code
  token: string;        // auth token (if any)
}

// other exports…
export interface VivoProduct {
  "@odata.etag": string;
  Code: string;
  Description: string;
  Commission_Rate: number;
}

export interface IndividualTarget {
  "@odata.etag": string;
  User_code: string;
  User_Name: string;
  Role_ID: string;
  Role_Name: string;
  Daily_Target: number;
  Region_Code: string;
  Region_Name: string;
  Outlet_Code: string;
  Outlet_Name: string;
  SKU_Code?: string;
  SKU_Name?: string;
  SKU_Litres?: number;
  Grade?: string;
  Incentive_Ratio?: number;
  Target_Date: string;
}

export interface ProductSKU {
  '@odata.etag': string;
  SKU_Code: string;
  SKU_Name: string;
  SKU_Litres: number;
  Grade: string;
  Incentive_Ratio: number;
}
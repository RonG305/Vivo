"use server";

import { cookies } from "next/headers";
import { API_AUTHORIZATION } from "./constants";

export const fetchData = async (url: string, options?: RequestInit) => {
  const token = (await cookies()).get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...({ Authorization: `${API_AUTHORIZATION}` }),
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!response.ok)
      throw new Error(`HTTP error!, status: ${response.status}`);

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createData = async (
  url: string,
  data: object,
  options?: RequestInit
) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...{ Authorization: `${API_AUTHORIZATION}` },
        ...(options?.headers || {}),
      },
      body: JSON.stringify(data),
      
    });

    if (!response.ok)
      throw new Error(`HTTP Error!, status: ${response.status}`);
    // console.log(await response.json());
    const responseData = response.json();
    console.log("Response Data: ", responseData);
    return responseData;
  } catch (error) {
    console.log("Failed to create ", error);
    throw error;
  }
};

export const updateData = async (
  url: string,
  data: object,
  options?: RequestInit
) => {
  const token = (await cookies()).get("token")?.value;
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options?.headers || {}),
      },
      body: JSON.stringify(data),

      ...options,
    });

    if (!response.ok)
      throw new Error(`HTTP Error!, status: ${response.status}`);
    const responseData = response.json();
    return responseData;
  } catch (error) {
    console.log("Failed to update ", error);
    throw error;
  }
};

export const deleteData = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok)
      throw new Error(`HTTP Error!, status: ${response.status}`);
    const responseData = response.json();
    return responseData;
  } catch (error) {
    console.log("Failed to delete ", error);
    throw error;
  }
};
